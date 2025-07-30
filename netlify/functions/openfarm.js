export async function handler(event) {
  const nome = event.queryStringParameters?.nome;

  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
  };

  if (!nome) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: "Parâmetro 'nome' obrigatório" }),
    };
  }

  try {
    const url = `https://www.openfarm.cc/api/v1/crops/?filter=${encodeURIComponent(nome)}`;
    const response = await fetch(url, { redirect: "follow" });

    if (!response.ok) {
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({ error: `Erro na OpenFarm: ${response.statusText}` }),
      };
    }

    const data = await response.json();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Erro interno no proxy", details: error.message }),
    };
  }
}