const API_URL = process.env.NEXT_PUBLIC_API_URL!;
export async function createFeedback(token: string, data: {
  rating: number;
  message: string;
}) {
  const res = await fetch(`${API_URL}/feedback`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
  const error = await res.json();
  throw new Error(error.detail || "Failed to submit feedback");
}

  return res.json();
}

export async function getMyFeedback(token: string) {
  const res = await fetch(`${API_URL}/feedback/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to load feedback");
  }

  return res.json();
}

export async function getAllFeedback(token: string) {
  const res = await fetch(`${API_URL}/feedback/admin`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to load feedback");
  }

  return res.json();
}

export async function getAllFeedbacks(token: string) {
    const res = await fetch(
        `${API_URL}/admin/feedbacks`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    if (!res.ok) {
        throw new Error("Failed to fetch feedback.");
    }

    return res.json();
}