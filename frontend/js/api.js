// public/js/api.js
async function apiFetch(path, method='GET', body=null){
  const opts = { method, headers: {} };
  if (body){ opts.headers['Content-Type'] = 'application/json'; opts.body = JSON.stringify(body); }
  const res = await fetch(path, opts);
  try { return await res.json(); } catch(e) { return { success:false, error:'invalid-json' }; }
}
