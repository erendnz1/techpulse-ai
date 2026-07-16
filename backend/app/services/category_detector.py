CATEGORY_KEYWORDS = {
    "AI": [
        "openai",
        "chatgpt",
        "gpt",
        "claude",
        "anthropic",
        "gemini",
        "llama",
        "hugging face",
        "copilot",
        "ai",
    ],
    "Security": [
        "cve",
        "malware",
        "ransomware",
        "exploit",
        "vulnerability",
        "security",
        "hack",
        "phishing",
        "zero-day",
    ],
    "Cloud": [
        "aws",
        "azure",
        "google cloud",
        "cloudflare",
        "cloud",
    ],
    "DevOps": [
        "docker",
        "kubernetes",
        "terraform",
        "ansible",
        "jenkins",
        "devops",
    ],
    "Framework": [
        "react",
        "next.js",
        "nextjs",
        "vue",
        "angular",
        "nuxt",
        "svelte",
    ],
    "Developer Tools": [
        "github",
        "gitlab",
        "jetbrains",
        "visual studio",
        "vs code",
        "vscode",
        "intellij",
    ],
    "Mobile": [
        "android",
        "iphone",
        "ios",
        "ipad",
        "galaxy",
        "pixel",
        "one ui",
    ],
    "Gaming": [
        "playstation",
        "xbox",
        "steam",
        "epic games",
        "nintendo",
        "game",
    ],
    "Business": [
        "investment",
        "startup",
        "earnings",
        "revenue",
        "market",
    ],
}
def detect_category(title: str, content: str = "") -> str:
    text = f"{title} {content}".lower()

    for category, keywords in CATEGORY_KEYWORDS.items():
        for keyword in keywords:
            if keyword in text:
                return category

    return "Other"