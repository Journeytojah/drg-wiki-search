import {
    redirectFromFandom,
    redirectFromSearchEngine
} from "./redirects.js"

describe("Fandom redirect", () => {
    it.each([{
            url: "https://deeprockgalactic.fandom.com/wiki/ArmsKore_Coil_Gun",
            expected: "https://deeprockgalactic.wiki.gg/wiki/ArmsKore_Coil_Gun",
        },
        {
            url: "https://deeprockgalactic.fandom.com/wiki/Gunner",
            expected: "https://deeprockgalactic.wiki.gg/wiki/Gunner",
        },
        {
            url: "https://deeprockgalactic.fandom.com/wiki/Deep_Rock_Galactic_Wiki",
            expected: "https://deeprockgalactic.wiki.gg/wiki/Deep_Rock_Galactic_Wiki",
        },
    ])("Given $url, redirect to $expected", ({
        url,
        expected
    }) => {
        const actual = redirectFromFandom({
            url
        })
        expect(actual.redirectUrl).toBe(expected)
    })
})

describe("Test queries against all Search Engines redirect", () => {
    // Setup different Search Engine urls to test against
    const googleUrls = [
        "https://google.com/search?",
        "https://www.google.com/search?"
    ]

    const duckduckgoUrls = [
        "https://duckduckgo.com/?",
        "https://www.duckduckgo.com/?"
    ]

    // The base redirect result URL to expect from each search engine
    const redirectBaseUrls = {
        google: "https://www.google.com/search?q=site:deeprockgalactic.wiki.gg+",
        duckduckgo: "https://www.duckduckgo.com/?q=site:deeprockgalactic.wiki.gg+"
    }

    // Run the tests for a given search engine
    runTestQueries(googleUrls, "google")
    runTestQueries(duckduckgoUrls, "duckduckgo")

    function runTestQueries(urlCollection, searchEngine) {
        const redirectBaseUrl = redirectBaseUrls[searchEngine]

        urlCollection.forEach(baseUrl =>
            it.each([{
                    url: baseUrl + "q=drg+armskore+gun",
                    expected: redirectBaseUrl + "armskore+gun"
                },
                // Noisy query parameters cases
                {
                    url: baseUrl + "client=firefox-b-1-d&q=drgwiki+armskore+gun",
                    expected: redirectBaseUrl + "armskore+gun",
                },
                {
                    url: baseUrl + "q=drgwiki+armskore+gun&rlz=1CDSA2EA_enUS653US116&oq=drg+test+wiki&aqs=chrome..6213i57j64.1j7&sourceid=chrome&ie=UTF-8",
                    expected: redirectBaseUrl + "armskore+gun",
                },
                {
                    url: baseUrl + "q=drgwiki+armskore+gun",
                    expected: redirectBaseUrl + "armskore+gun",
                },
                // Wildcard *drg*wiki* cases
                {
                    url: baseUrl + "q=drg+wiki+armskore+gun",
                    expected: redirectBaseUrl + "armskore+gun",
                },
                {
                    url: baseUrl + "q=drg++wiki+armskore+gun",
                    expected: redirectBaseUrl + "armskore+gun",
                },
                {
                    url: baseUrl + "q=drg+armskore+gun+wiki",
                    expected: redirectBaseUrl + "armskore+gun",
                },
                {
                    url: baseUrl + "q=armskore+drg+gun+wiki",
                    expected: redirectBaseUrl + "armskore+gun",
                },
                {
                    url: baseUrl + "q=armskore+gun+drg+wiki",
                    expected: redirectBaseUrl + "armskore+gun",
                },
                {
                    url: baseUrl + "q=armskore+gun+drgwiki",
                    expected: redirectBaseUrl + "armskore+gun",
                },
                {
                    url: baseUrl + "q=armskore+drgwiki+gun",
                    expected: redirectBaseUrl + "armskore+gun",
                },
                // Making sure words that happen to contain "drg", "wiki" or "drgwiki" do not get filtered
                {
                    url: baseUrl + "q=drg+adrg+drga+adrga+awiki+wikia+awikia+wiki+adrgwiki+drgwikia+adrgwikia+drgawiki",
                    expected: redirectBaseUrl + "adrg+drga+adrga+awiki+wikia+awikia+adrgwiki+drgwikia+adrgwikia+drgawiki",
                },
            ])(searchEngine + " - Given $url, redirect to $expected", ({
                url,
                expected
            }) => {
                const actual = redirectFromSearchEngine({
                    url
                })
                expect(actual.redirectUrl).toBe(expected)
            })
        )
    }
})