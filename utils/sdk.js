var input = null;
var results = null;
var loader = null;
var readMore = null;
// var examples = [
//   document.getElementById("letterdrop-example1"),
//   document.getElementById("letterdrop-example2")
// ];
var loading = false;

// examples.forEach((example) => {
//   example.addEventListener("click", async () => {
//     if (loading) return;
//     input.value = example.value;
//     getAnswer();
//   });
// });
var intervalId = setInterval(() => {
  input = document.getElementById("letterdrop-input");
  if (input) {
    input.addEventListener("keydown", async (event) => {
      if (event.key === "Enter") getAnswer();
    });
    clearInterval(intervalId);
  }
}, 100);

function toggleLoading() {
  loading = !loading;
  loader.style.display = loading ? "block" : "none";
  results.style.display = loading ? "none" : "flex";
  readMore.style.display = loading ? "none" : "flex";
}

async function getAnswer() {
  input = input || document.getElementById("letterdrop-input");
  results = results || document.getElementById("letterdrop-results");
  loader = loader || document.getElementById("letterdrop-loader");
  readMore = readMore || document.getElementById("letterdrop-read-more");

  if (loading || !input.value?.trim()) return;

  toggleLoading();
  try {
    const response = await fetch(
      `http://127.0.0.1:5000/querycontent?publicationId=${publicationId}&question=${encodeURIComponent(
        input.value
      )}`
    );
    const {
      success,
      answer = "We were unable to answer your query. Try again.",
      source = []
    } = await response.json();

    results.style.display = "flex";
    results.innerText = success
      ? answer
      : "We were unable to answer your query. Try again.";
    if (success) {
      addReadMoreArticles(source);
    }
  } catch (error) {
    console.error("Error: ", error);
    results.innerText = "We were unable to answer your query. Try again.";
  }
  toggleLoading();
}

function addReadMoreArticles(sourceList) {
  if (sourceList?.length) {
    readMore.style.display = "flex";
    readMore.innerHTML = "";
    readMore.innerHTML = "<label>Read more</label>";
    sourceList.forEach((source) => {
      let { url, image, title, description } = source;

      const articleDiv = document.createElement("div");
      articleDiv.className = "letterdrop-article";

      const imageElement = document.createElement("img");
      imageElement.src = image;
      imageElement.alt = "Cover image";
      imageElement.className = "letterdrop-image";

      const articleDetails = document.createElement("div");
      articleDetails.className = "letterdrop-article-details";

      const titleElement = document.createElement("label");
      titleElement.innerText = title;
      titleElement.className = "letterdrop-article-title letterdrop-ellipsis";

      const descriptionElement = document.createElement("label");
      descriptionElement.innerText = description;
      descriptionElement.className =
        "letterdrop-article-description letterdrop-ellipsis";

      const anchorElement = document.createElement("a");
      anchorElement.href = url;
      anchorElement.innerText = url;
      anchorElement.target = "_blank";
      anchorElement.rel = "noreferrer";
      anchorElement.className = "letterdrop-article-link letterdrop-ellipsis";

      if (title?.trim()) {
        articleDetails.appendChild(titleElement);
      }
      if (description?.trim()) {
        articleDetails.appendChild(descriptionElement);
      }
      articleDetails.appendChild(anchorElement);

      if (image) {
        articleDiv.appendChild(imageElement);
      }
      articleDiv.appendChild(articleDetails);

      readMore.appendChild(articleDiv);
    });
  }
}
