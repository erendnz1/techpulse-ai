import requests

GITHUB_REPOSITORIES = [
    "fastapi/fastapi",
    "vercel/next.js",
    "facebook/react",
]


def fetch_github_releases():
    releases = []

    for repository in GITHUB_REPOSITORIES:
        url = f"https://api.github.com/repos/{repository}/releases/latest"

        response = requests.get(url, timeout=10)
        response.raise_for_status()

        release = response.json()
        release["repository"] = repository

        releases.append(release)

    return releases

def transform_github_release(release):
    repository = release.get("repository", "Unknown")

    return {
        "title": f"{repository} - {release.get('name') or release.get('tag_name')}",
        "content": release.get("body") or "No release notes available.",
        "source": "GitHub Releases",
        "url": release.get("html_url"),
        "image_url": None,
        "author": release.get("author", {}).get("login"),
        "published_at": release.get("published_at"),
        "category": "Developer Tools",
        "region": "global",
    }