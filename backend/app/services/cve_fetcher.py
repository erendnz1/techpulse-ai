import requests

from datetime import datetime, timedelta, UTC

def fetch_recent_cves():
    url = "https://services.nvd.nist.gov/rest/json/cves/2.0"

    end_date = datetime.now(UTC)
    start_date = end_date - timedelta(days=1)

    params = {
        "pubStartDate": start_date.isoformat(timespec="milliseconds"),
        "pubEndDate": end_date.isoformat(timespec="milliseconds"),
        "resultsPerPage": 3,
    }

    response = requests.get(
        url,
        params=params,
        timeout=20,
    )

    response.raise_for_status()

    data = response.json()

    return data.get("vulnerabilities", [])

def transform_cve(vulnerability):
    cve = vulnerability.get("cve", {})

    cve_id = cve.get("id", "Unknown CVE")

    descriptions = cve.get("descriptions", [])

    description = next(
        (
            item.get("value")
            for item in descriptions
            if item.get("lang") == "en"
        ),
        "No description available."
    )

    return {
    "title": cve_id,
    "content": description,
    "source": "NVD",
    "url": f"https://nvd.nist.gov/vuln/detail/{cve_id}",
    "image_url": None,
    "author": "NVD",
    "category": "Security",
    "region": "global",
    "published_at": cve.get("published"),
}