const brevoHeaders = () => ({
  'api-key': process.env.BREVO_API_KEY,
  'Content-Type': 'application/json',
  'accept': 'application/json',
})

export async function addContactToList(email, listId, attributes = {}) {
  if (!email || !listId) return
  try {
    const res = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: brevoHeaders(),
      body: JSON.stringify({
        email,
        attributes,
        listIds: [parseInt(listId)],
        updateEnabled: true,
      }),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      console.error(`[brevo] addContactToList (list ${listId}):`, err.message || res.status)
    }
  } catch (err) {
    console.error(`[brevo] addContactToList fetch error (list ${listId}):`, err?.message)
  }
}

export async function sendTransactionalEmail(to, templateId, params) {
  try {
    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: brevoHeaders(),
      body: JSON.stringify({
        to: [{ email: to }],
        templateId,
        params,
      }),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      console.error(`[brevo] sendTransactionalEmail (template ${templateId}):`, err.message || res.status)
    }
  } catch (err) {
    console.error(`[brevo] sendTransactionalEmail fetch error (template ${templateId}):`, err?.message)
  }
}

export async function removeContactFromList(email, listId) {
  if (!email || !listId) return
  try {
    const res = await fetch(
      `https://api.brevo.com/v3/contacts/lists/${listId}/contacts/remove`,
      {
        method: 'POST',
        headers: brevoHeaders(),
        body: JSON.stringify({ emails: [email] }),
      }
    )
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      console.error(`[brevo] removeContactFromList (list ${listId}):`, err.message || res.status)
    }
  } catch (err) {
    console.error(`[brevo] removeContactFromList fetch error (list ${listId}):`, err?.message)
  }
}
