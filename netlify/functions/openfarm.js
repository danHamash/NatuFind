export async function handler(event, context) {
  const { nome } = event.queryStringParameters;

  if (!nome) {
    return { statusCode: 400, body: "Parâmetro 'nome' obrigatório" };
  }

  try {
    const url = `https://www.openfarm.cc/api/v1/crops/?filter=${encodeURIComponent(nome)}`;
    const res = await fetch(url);
    const data = await res.json();

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Erro ao buscar na OpenFarm" }),
    };
  }
}