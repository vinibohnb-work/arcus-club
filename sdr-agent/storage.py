"""
Integração com Supabase — inserção e deduplicação de leads na tabela vini_leads.
Usa Service Role Key para bypass de RLS (agente server-side).

Os leads do SDR Agent entram diretamente no CRM do Vinicius com:
  - source = 'SDR Agent'
  - stage  = 'mapeado'
  - sdr_data = { score, qualification_notes, original_source, ... }
"""

import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

_supabase: Client | None = None

TABLE = "vini_leads"

# Campos verificados para deduplicação (em ordem de prioridade)
_DEDUP_FIELDS = [
    ("linkedin", "linkedin_url"),   # (coluna em vini_leads, chave no lead dict)
    ("phone",    "phone"),
]


def _get_client() -> Client:
    global _supabase
    if _supabase is None:
        url = os.getenv("SUPABASE_URL")
        key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
        if not url or not key:
            raise ValueError(
                "SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são obrigatórios no .env"
            )
        _supabase = create_client(url, key)
    return _supabase


def lead_exists(lead: dict) -> bool:
    """Verifica duplicata em vini_leads pelos campos de contato."""
    db = _get_client()
    for col, key in _DEDUP_FIELDS:
        value = lead.get(key)
        if value:
            result = db.table(TABLE).select("id").eq(col, value).execute()
            if result.data:
                return True
    return False


def _map_to_vini_lead(lead: dict) -> dict:
    """
    Converte um lead do formato SDR Agent para o schema de vini_leads.
    Campos SDR-específicos são compactados em sdr_data.
    """
    # Nome preferencial: founder_name → name → company_name
    name = (
        lead.get("founder_name")
        or lead.get("name")
        or lead.get("company_name")
        or "Lead SDR"
    )

    # Notas legíveis: qualificação + dados geográficos/segmento
    notes_parts = []
    if lead.get("qualification_notes"):
        notes_parts.append(lead["qualification_notes"])
    location = ", ".join(filter(None, [lead.get("city"), lead.get("state")]))
    if location:
        notes_parts.append(f"Localização: {location}")
    if lead.get("segment"):
        notes_parts.append(f"Segmento: {lead['segment']}")
    if lead.get("email"):
        notes_parts.append(f"E-mail: {lead['email']}")
    if lead.get("website"):
        notes_parts.append(f"Site: {lead['website']}")
    if lead.get("instagram_handle"):
        notes_parts.append(f"Instagram: @{lead['instagram_handle']}")

    # Metadados SDR preservados em sdr_data
    sdr_data = {
        "score":               lead.get("qualification_score"),
        "qualification_notes": lead.get("qualification_notes"),
        "original_source":     lead.get("source"),
        "source_url":          lead.get("source_url"),
        "source_query":        lead.get("source_query"),
        "instagram_handle":    lead.get("instagram_handle"),
        "email":               lead.get("email"),
        "website":             lead.get("website"),
        "cnpj":                lead.get("cnpj"),
        "segment":             lead.get("segment"),
        "employees_estimate":  lead.get("employees_estimate"),
        "revenue_estimate":    lead.get("revenue_estimate"),
        "city":                lead.get("city"),
        "state":               lead.get("state"),
        "raw_data":            lead.get("raw_data"),
    }
    # Remove chaves nulas para não poluir o JSON
    sdr_data = {k: v for k, v in sdr_data.items() if v is not None}

    return {
        "name":     name,
        "company":  lead.get("company_name") or "",
        "phone":    lead.get("phone") or "",
        "linkedin": lead.get("linkedin_url") or "",
        "source":   "SDR Agent",
        "stage":    "mapeado",
        "notes":    "\n".join(notes_parts),
        "sdr_data": sdr_data,
    }


def insert_lead(lead: dict) -> bool:
    """
    Insere um lead no CRM (vini_leads) se não for duplicata.
    Retorna True se inserido, False se era duplicata ou houve erro.
    """
    db = _get_client()

    try:
        if lead_exists(lead):
            return False

        row = _map_to_vini_lead(lead)

        if not row.get("name"):
            return False

        db.table(TABLE).insert(row).execute()
        return True

    except Exception as e:
        name = lead.get("founder_name") or lead.get("name") or lead.get("company_name", "?")
        print(f"[Storage] Erro ao inserir '{name}': {e}")
        return False


def get_stats() -> dict:
    """Retorna estatísticas dos leads SDR dentro de vini_leads."""
    db = _get_client()

    try:
        rows = (
            db.table(TABLE)
            .select("id, sdr_data, stage")
            .eq("source", "SDR Agent")
            .execute()
        )

        total = len(rows.data or [])
        stage_counts: dict[str, int] = {}
        score_sum = 0
        score_count = 0

        for row in rows.data or []:
            st = row.get("stage", "mapeado")
            stage_counts[st] = stage_counts.get(st, 0) + 1

            sdr = row.get("sdr_data") or {}
            score = sdr.get("score")
            if score is not None:
                score_sum += score
                score_count += 1

        avg_score = round(score_sum / score_count, 1) if score_count else 0

        return {
            "total":      total,
            "by_stage":   stage_counts,
            "avg_score":  avg_score,
        }

    except Exception as e:
        print(f"[Storage] Erro ao buscar stats: {e}")
        return {"total": 0, "by_stage": {}, "avg_score": 0}
