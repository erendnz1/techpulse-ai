class QuotaExceededError(Exception):
    """Raised when Groq daily quota is exhausted."""
    pass