const fetchGraphql = async (query) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "Access-Control-Allow-Origin": '*',
    },
    body: JSON.stringify(query),
  };
  try {
    console.log("query", query);
    const response = await fetch("http://localhost:3000/graphql", options);
    const json = await response.json();
    return json.data;
  } catch (e) {
    console.log(e);
    return false;
  }
};

const addAnimal = async (animal) => {
  console.log("addAnimal animal:", animal)
  const query = {
    query: `
            mutation VariableTest($animalName: String!, $species: ID!) {
              addAnimal(animalName: $animalName, species: $species) {
                id
                animalName
              }
            }`,
    variables: animal,
  };
  const data = await fetchGraphql(query);
  console.log("addAnimal data:". data)
  return data;//.addAnimal;
};

const getAnimals = async () => {
  const otherQuery = {
    query: `
    {
    animals {
      id
      animalName
      species {
        id
        speciesName
        category {
          id
          categoryName
        }
      }
    }
    }`,
  };
  const data = await fetchGraphql(otherQuery);
  return data;
};

const getSpecies = async () => {
  const otherQuery = {
    query: `
       { species { id speciesName } }
    `,
  };
  const data = await fetchGraphql(otherQuery);
  return data;
};
