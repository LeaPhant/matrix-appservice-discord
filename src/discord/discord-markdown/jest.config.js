module.exports = {
	collectCoverage: true,
	coverageReporters: ["cobertura"],
	coverageDirectory: "report",
	reporters: [
		"default",
		["jest-junit", {usePathForSuiteName: true, outputDirectory: 'report'}]
	],
	testResultsProcessor: "jest-junit"
}
