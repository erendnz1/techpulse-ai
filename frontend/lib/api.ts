const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function createFeedback(
  token: string,
  data: {
    rating: number;
    message: string;
  }
) {
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
    const errorText = await res.text();

    console.error("Status:", res.status);
    console.error("Response:", errorText);

    throw new Error(`Failed to load feedback (${res.status})`);
  }

  return res.json();
}

export async function getAllFeedbacks(token: string) {
  const res = await fetch(`${API_URL}/admin/feedbacks`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch feedback.");
  }

  return res.json();
}

export async function updateFeedback(
  id: number,
  data: {
    status: string;
    admin_note: string | null;
  },
  token: string
) {
  const res = await fetch(`${API_URL}/admin/feedbacks/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to update feedback.");
  }

  return res.json();
}