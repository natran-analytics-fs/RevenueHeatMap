export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response('ok', {
        headers: {
          'Access-Control-Allow-Origin': env.CORS_ORIGIN || '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'content-type'
        }
      });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    const cors = {
      'Access-Control-Allow-Origin': env.CORS_ORIGIN || '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'content-type',
      'Content-Type': 'application/json'
    };

    try {
      const body = await request.json();

      const payload = {
        event_type: 'heatmap_publish',
        client_payload: {
          billing_json: body.billing_json || '',
          ranges_json: body.ranges_json || '',
          shapes_geojson: body.shapes_geojson || ''
        }
      };

      const url = `https://api.github.com/repos/${env.GH_OWNER}/${env.GH_REPO}/dispatches`;

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.DISPATCH_PAT}`,
          'Accept': 'application/vnd.github+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const t = await res.text();
        return new Response(JSON.stringify({ ok:false, error:`GitHub dispatch failed: ${res.status} ${t}` }), { status: 500, headers: cors });
      }

      return new Response(JSON.stringify({ ok:true }), { status: 200, headers: cors });
    } catch (e) {
      return new Response(JSON.stringify({ ok:false, error:e.message }), { status: 400, headers: cors });
    }
  }
};
