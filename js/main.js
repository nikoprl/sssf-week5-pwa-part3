"use strict";

(async () => {
  const ul = document.querySelector("ul");
  const specieSelector = document.getElementById("species");
  const rfrsh = document.querySelector("#refresh");
  const form = document.querySelector("form");
  const animaltbx = form.elements.animal;
  
  console.log("hello");

  if ("serviceWorker" in navigator) {
    try {
      await navigator.serviceWorker.register("./sw.js");
      const registration = await navigator.serviceWorker.ready;

      if (registration.sync) {
        form.addEventListener("submit", async (event) => {
          event.preventDefault();

          const animal = {
            animalName: animaltbx.value,
            species: specieSelector.value,
          };
          const  speciesname= specieSelector.options[specieSelector.selectedIndex].text;
          try {
            saveData("outbox", animal);
            saveData("inbox", {
              animalName: animaltbx.value,
              species: {
                id: specieSelector.value,
                speciesName: speciesname,
              },
            });

            await registration.sync.register("animal-sync");
          } catch (e) {
            console.log(e.message);
          }

        });
      }
    } catch (e) {
      console.log("error: ", e);
    }
  }

  const init = async () => {
    const data = [];
    const speciesdata = [];

    try {
      if (navigator.onLine) {
        const species = await getSpecies();
        console.log("species:", species);
        await clearData("species");

        for (const specie of species.species) {
          console.log("specie:", specie);
          speciesdata.push(specie);
          saveData("species", specie);
        }
      } else {
        const species = await loadData("species");
        console.log("saved species:", species);

        for (const specie of species) {
          console.log("specie:", specie);
          speciesdata.push(specie);
        }
      }

      if (navigator.onLine) {
        await clearData("inbox");
        const adb = await getAnimals();
        console.log("animals:", adb);

        for (const animal of adb.animals) {
          data.push(animal);
          await saveData("inbox", animal);
        }

      } else {
        const animals = await loadData("inbox");
        for (const animal of animals) {
          data.push(animal);
        }
      }
    } catch (e) {
      console.log(e.message);
    }

    specieSelector.innerHTML = "";
    speciesdata.forEach((specie) => {
      specieSelector.innerHTML += `<option value="${specie.id}">${specie.speciesName}</option>`;
    });

    ul.innerHTML = "";
    console.log(data);
    data.forEach((animal) => {
      ul.innerHTML += `<ul>${animal.animalName} : ${animal.species.speciesName}</ul>`;
    });
  };

  init();

  rfrsh.addEventListener("click", init);
})();
