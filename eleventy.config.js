import markdownIt from "markdown-it";

export default function (eleventyConfig) {
    const md = markdownIt({
        html: true,
        linkify: true,
        typography: true
    });

    // Copy public folder to _site
    eleventyConfig.addPassthroughCopy("public");

    // Watch for changes in public folder
    eleventyConfig.addWatchTarget("public");

    // Ignore directories
    eleventyConfig.ignores.add("scripts/**");
    eleventyConfig.ignores.add("legacy-react/**");
    eleventyConfig.ignores.add("node_modules/**");
    eleventyConfig.ignores.add("venv/**");
    eleventyConfig.ignores.add("README.md");

    // Filter to format dates
    eleventyConfig.addFilter("date", (dateStr) => {
        if (!dateStr || dateStr === "now") {
            return new Date().toLocaleDateString();
        }
        const date = new Date(dateStr);
        return date.toLocaleDateString();
    });

    eleventyConfig.addFilter("slugify", (str) => {
        return str.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
    });

    // Filter to render markdown
    eleventyConfig.addFilter("markdown", (content) => {
        return md.render(content || "");
    });

    // Custom filters for grouping
    eleventyConfig.addFilter("filterByTopic", (projects, topic) => {
        return projects.filter(p => p.topics && p.topics.includes(topic));
    });

    eleventyConfig.addFilter("excludeByTopic", (projects, topic) => {
        return projects.filter(p => !p.topics || !p.topics.includes(topic));
    });

    return {
        dir: {
            input: ".",
            output: "_site",
            data: "_data",
            includes: "_includes"
        }
    };
}
