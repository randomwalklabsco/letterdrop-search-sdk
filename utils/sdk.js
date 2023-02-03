(function () {
  const BASE_URL = "https://transcript-analysis-3k44zkbrua-uc.a.run.app";
  async function getSearchResult(question, publicationId) {
    try {
      const formData = new FormData();
      formData.set("question", question);
      formData.set("publicationId", publicationId);

      const response = await fetch(`${BASE_URL}/querycontent`, {
        method: "POST",
        body: formData
      });

      const {
        success,
        answer = "We were unable to answer your query. Try again.",
        source = []
      } = await response.json();

      if (success) {
        return {
          answer,
          source
        };
      }
    } catch (error) {
      console.error("Error: ", error);
      results.innerText = "We were unable to answer your query. Try again.";
    }
    return {
      answer: "We were unable to answer your query. Try again.",
      source: []
    };
  }

  module.exports = {
    getSearchResult
  };
})();
