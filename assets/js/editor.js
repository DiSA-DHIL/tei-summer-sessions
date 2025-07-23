import { EditorView, basicSetup } from "codemirror";
import { keymap } from "@codemirror/view";
import { indentWithTab } from "@codemirror/commands";
import { xml } from "@codemirror/lang-xml";
import * as L from "leaflet";

const globalElements = [
  {
    name: "idno",
  },
  {
    name: "note",
  },
  {
    name: "head",
  },
  {
    name: "date",
  },
  {
    name: "ptr",
    attributes: ["target"],
  },
  {
    name: "placeName",
    attributes: ["type", "from", "to", "notBefore", "notAfter", "when"],
  },
  {
    name: "state",
    attributes: ["from", "to", "notBefore", "notAfter", "when"],
  },
  {
    name: "trait",
  },
];
const personElements = [
  {
    name: "listPerson",
    children: ["person", "note", "head"],
    top: true,
  },
  {
    name: "person",
    children: [
      "persName",
      "birth",
      "death",
      "occupation",
      "affiliation",
      "socecStatus",
      "faith",
      "sex",
      "gender",
      "note",
      "idno",
      "persona",
      "state",
      "trait",
      "ptr",
    ],
  },
  {
    name: "persName",
    children: ["forename", "surname", "addName"],
    attributes: ["from", "to", "notBefore", "notAfter", "when"],
  },
  {
    name: "forename",
    attributes: ["type"],
  },
  {
    name: "surname",
    attributes: ["type"],
  },
  {
    name: "addName",
    attributes: ["type"],
  },
  {
    name: "socecStatus",
  },
  {
    name: "persona",
    children: [
      "persName",
      "birth",
      "death",
      "occupation",
      "affiliation",
      "socecStatus",
      "faith",
      "sex",
      "gender",
      "note",
      "idno",
      "persona",
      "state",
      "trait",
    ],
  },
  {
    name: "faith",
    attributes: ["from", "to", "notBefore", "notAfter", "when"],
  },
  {
    name: "birth",
    children: ["date", "placeName"],
    attributes: ["from", "to", "notBefore", "notAfter", "when"],
  },
  {
    name: "death",
    children: ["date", "placeName"],
    attributes: ["from", "to", "notBefore", "notAfter", "when"],
  },
  {
    name: "occupation",
    attributes: ["from", "to", "notBefore", "notAfter", "when"],
  },

  {
    name: "affiliation",
    children: ["orgName", "note"],
    attributes: ["from", "to", "notBefore", "notAfter", "when"],
  },
  {
    name: "orgName",
    attributes: ["from", "to", "notBefore", "notAfter", "when"],
  },

  {
    name: "sex",
  },
  {
    name: "gender",
  },
];
const placeElements = [
  {
    name: "listPlace",
    children: ["place", "head", "note"],
    top: true,
  },
  {
    name: "place",
    children: [
      "placeName",
      "location",
      "country",
      "settlement",
      "region",
      "idno",
      "note",
      "state",
      "trait",
      "ptr",
    ],
  },
  {
    name: "location",
    children: ["geo"],
  },
  {
    name: "geo",
  },
  {
    name: "settlement",
    attributes: ["from", "to", "notBefore", "notAfter", "when"],
  },
  {
    name: "region",
    attributes: ["from", "to", "notBefore", "notAfter", "when"],
  },
  {
    name: "country",
    attributes: ["from", "to", "notBefore", "notAfter", "when"],
  },
];

const attributes = [
  {
    name: "xml:id",
    global: true,
  },
  {
    name: "xml:lang",
    global: true,
  },
  {
    name: "ref",
  },
  {
    name: "when",
  },
  {
    name: "key",
  },
  {
    name: "cert",
    global: true,
  },
  {
    name: "source",
    global: true,
  },
  {
    name: "resp",
    global: true,
  },
  {
    name: "n",
    global: true,
  },
  {
    name: "from",
  },
  {
    name: "to",
  },
  {
    name: "type",
  },
  {
    name: "notBefore",
  },
  {
    name: "notAfter",
  },
  {
    name: "interval",
  },
];

function autosavePlugin(storageKey) {
  return EditorView.updateListener.of((update) => {
    if (update.docChanged) {
      localStorage.setItem(storageKey, update.state.doc.toString());
    }
  });
}

const peopleTemplate = `
<listPerson>
<person xml:id="pjohnson" xml:lang="en">
  <persName>
  </persName>

  <birth></birth>
  <death></death>

  <!-- Add relevant occupations -->
  <occupation></occupation>
  <occupation></occupation>

  <!-- Add affiliations, e.g. to Mohawk nation, literary scenes -->
  <affiliation></affiliation>

  <!-- Add external authority reference -->
  <linkGrp>
    <ptr target="https://thepeopleandthetext.ca/featured-authors/EPaulineJohnson"/>
  </linkGrp>

  <!-- Add a note about her identity, performance, and legacy -->
  <note></note>
</person>
  </listPerson>`;

const placesTemplate = `
  <listPlace>
  <place>
     <placeName>Vancouver</placeName>
     <country>Canada</country>
     <location>
      <geo>"geometry": {"type":"Point","coordinates":[-123.113952,49.260872]}</geo>
    </location>
  </place>
  <place>
     
  </place>
 </listPlace>`;

const editors = {
  people: {
    id: "people-editor",
    template: peopleTemplate,
    elements: personElements,
  },
  places: {
    id: "places-editor",
    template: placesTemplate,
    elements: placeElements,
  },
};

Object.keys(editors).forEach((key) => {
  const obj = editors[key];
  const { id, template, elements } = obj;
  obj.editor = new EditorView({
    parent: document.getElementById(id),
    doc: localStorage.getItem(id) || template,
    extensions: [
      basicSetup,
      keymap.of([indentWithTab]),
      xml({
        elements: [].concat(...elements, ...globalElements),
        attributes,
      }),
      autosavePlugin(id),
    ],
  });
});

//  editors.people.editor = new EditorView({
//     parent: document.querySelector(`#${editors.people.id}`),
//     doc: localStorage.getItem(editor) || peopleTemplate,
//     extensions: [
//       basicSetup,
//       keymap.of([indentWithTab]),
//       xml({
//         elements: [].concat(...globalElements, ...personElements),
//         attributes,
//       }),
//       autosavePlugin("people-editor"),
//     ],
//   }),
//   template:

//   } ,
//   places: new EditorView({
//     parent: document.querySelector("#places-editor"),
//     doc: localStorage.getItem("places-editor") || placesTemplate,
//     extensions: [
//       basicSetup,
//       keymap.of([indentWithTab]),
//       xml({
//         elements: [].concat(...globalElements, ...placeElements),
//         attributes,
//       }),
//       autosavePlugin("places-editor"),
//     ],
//   }),
// };

document.querySelectorAll("input").forEach((input) => {
  input.addEventListener("change", render);
});

document.querySelector("#render-preview").addEventListener("click", render);

function render() {
  const value = document.querySelector("input:checked").value;
  if (value == "places") {
    renderPlaces(value);
  } else {
    renderPeople();
  }
}

function renderPlaces(value) {
  const preview = document.querySelector("#preview-panel");
  preview.innerHTML = "";
  //Setup map
  const mapDiv = document.createElement("div");
  mapDiv.setAttribute("id", "map");
  preview.appendChild(mapDiv);
  const map = L.map("map").setView([0, 0], 2);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);
  const { editor } = editors[value];
  const xmlContent = editor.state.doc.toString();
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlContent, "text/xml");
  const places = xmlDoc.querySelectorAll("place:has(geo)");
  if (places.length === 0) {
    return;
  }
  const featureCollection = {
    type: "FeatureCollection",
    features: [...places].map((place) => {
      const placeName = place.querySelector("placeName").textContent;
      const ptr = place.querySelector("ptr[target]");
      const noteContent = place.querySelector("note")?.textContent.trim() ?? "";
      const geoText = place.querySelector("geo").textContent.trim() ?? "";
      let geometry;
      if (/^[-\d\.]+ [-\d\.]+$/gi.test(geoText)) {
        geometry = {
          type: "Point",
          coordinates: geoText.split(" ").reverse(),
        };
      } else
        try {
          const parsed = JSON.parse(`{ ${geoText} }`);
          geometry = parsed.geometry;
        } catch (e) {
          console.warn("Failed to parse geometry from <geo>:", geoText);
          return null; // Skip malformed features
        }
      return {
        type: "Feature",
        properties: {
          name: placeName,
          popupContent: `
            <h2>${placeName}</h2>
            ${ptr ? `<a href="${ptr}">${ptr}</a>` : ""}
            <div>
              ${noteContent}
            </div>
          
          `,
        },
        geometry,
      };
    }),
  };
  const geoJSONLayer = L.geoJSON(featureCollection, {
    onEachFeature: function (feature, layer) {
      if (feature.properties && feature.properties.popupContent) {
        layer.bindPopup(feature.properties.popupContent);
      }
    },
  }).addTo(map);
  map.fitBounds(geoJSONLayer.getBounds(), {
    maxZoom: 13,
  });
}

function renderPeople() {
  return false;
}

document.getElementById("reset").addEventListener("click", () => {
  const value = document.querySelector("input:checked").value;
  const { editor, template, id } = editors[value];
  editor.dispatch({
    changes: { from: 0, to: editor.state.doc.length, insert: template },
  });
  // Also reset localStorage if you're syncing it
  localStorage.setItem(id, template);
  render();
});
