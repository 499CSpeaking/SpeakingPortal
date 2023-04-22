/* eslint-disable @typescript-eslint/no-use-before-define */
"use strict";

if (!window.AWSPanorama) {
    window.AWSPanorama = {};
}

AWSPanorama.Init = (function () {
    var LOG_ENDPOINT = ".prod.pr.analytics.console.aws.a2z.com",
        DEFAULT_CONSOLE_REGION = "us-east-1",
        DEFAULT_NONCONSOLE_REGION = "us-west-1",
        MODALITY = "web",
        PANORAMA = "panorama",
        PROD_DOMAIN = "aws.amazon.com",
        ALPHA_DOC_DOMAIN = "alpha-docs-aws.amazon.com",
        defaultTrackerConstants = {
            cookieDomain: "aws.amazon.com",
            pluginsEnabledByDefault: true,
            modality: MODALITY,
        },
        denyListedServices = [], // add services to ignore here
        experimentalServices = [], // add services to test on in this array
        externalDefaultTrackerUrl =
            // eslint-disable-next-line max-len
            "https://a.b.cdn.console.awsstatic.com/28f13c91a0353f55e3a57f0cee8c2e1dbd279c6bcd2b441827730c4d981db41f/4cf26fa415eb46afbb9230986ea466610d4ff2e50b124107947b64ed72219879.js", // 2.8.27
        experimentalTrackerUrl =
            // eslint-disable-next-line max-len
            "https://a.b.cdn.console.awsstatic.com/eceaafcb1984b61acf911f7e759bb53aba4dee16828022094a43b59ef4524def/79553d5bc938487484a29f13943002a9e75a2fc43349421f9faf06046d189a9a.js", // 2.8.25 - Speed Index
        isProd = window.location.hostname.includes(PROD_DOMAIN) && !window.location.hostname.includes(ALPHA_DOC_DOMAIN), // determine if the environment is a Prod AWS property but not of Docs Alpha site
        windowAlias = window,
        log = function () {
            if (windowAlias.AWSC && windowAlias.AWSC.Clog && windowAlias.AWSC.Clog.log) {
                log = windowAlias.AWSC.Clog.log;
                return;
            }
            return undefined;
        };

    // Exit out early if Panorama is disabled on the page
    if (windowAlias.disablePanorama) {
        return;
    }

    /**
     * Utility function to check if we are within the AWS Console
     * @returns {boolean} indicating whether this is the console or not
     */
    var isAwsConsole = (function () {
        if (windowAlias.ConsoleNavService || getContentAttrFromMetaTag("awsc-mezz") !== null) {
            return true;
        }

        return false;
    })();

    /**
     * Extracts cookie value by name
     */
    var getCookieByName = function (name) {
        try {
            var cookie = document.cookie.split("; ").find((cookie) => cookie.split("=")[0] === name);
            return cookie ? cookie.split("=")[1] : "";
        } catch (e) {
            return "";
        }
    };

    if (isAwsConsole) {
        /**
         *  Function to get the partition name based on the console region
         *  @param consoleRegion {string} - the current Console region
         *  @returns the partition name for a given region
         * */
        function getPartitionForRegion(consoleRegion) {
            var awsPartitionName = {
                Aws: "aws",
                AwsUsGov: "aws-us-gov",
                AwsIso: "aws-iso",
                AwsIsoB: "aws-iso-b",
                AwsCn: "aws-cn",
            };

            if (consoleRegion.startsWith("us-gov-")) {
                return awsPartitionName.AwsUsGov;
            } else if (consoleRegion.startsWith("us-iso-")) {
                return awsPartitionName.AwsIso;
            } else if (consoleRegion.startsWith("us-isob-")) {
                return awsPartitionName.AwsIsoB;
            } else if (consoleRegion.startsWith("cn-")) {
                return awsPartitionName.AwsCn;
            }

            return awsPartitionName.Aws;
        }

        // if the ConsoleNavService object is available, proceed with tracker initialization
        if (windowAlias.ConsoleNavService && windowAlias.ConsoleNavService.Model) {
            var metaTagRegion = getContentAttrFromMetaTag("awsc-mezz-region");
            var metaTagService = getContentAttrFromMetaTag("awsc-mezz-service");
            var region = metaTagRegion || DEFAULT_CONSOLE_REGION,
                service = windowAlias.ConsoleNavService.Model.currentService.id || metaTagService;
            // Commercial regions where Panorama is not yet ready to be enabled
            // List of AWS regions to be excluded - ZAZ, MEL, HYD, ZRH, TLV
            var excludedAWSRegions = ["ap-southeast-4", "il-central-1"];

            // Only run rest of the code if on the Public partition, or if the current service does not match a deny-listed service, or if we are on a PhantomJS browser; this logic replaces the NavFAC checks
            if (
                getPartitionForRegion(region) !== "aws" ||
                excludedAWSRegions.indexOf(region) >= 0 ||
                denyListedServices.indexOf(service) >= 0 ||
                !!windowAlias.callPhantom
            ) {
                return;
            }

            var trackerConfig = {
                appEntity: "aws-console",
                console: true,
                region: region,
                service,
                trackerConstants: defaultTrackerConstants,
            };

            initializePanoramaTracker(
                region,
                windowAlias,
                document,
                "script",
                getTrackerUrl(service, true),
                PANORAMA,
                null,
                null,
                trackerConfig
            );
        }
    } else {
        try {
            var scriptTag = document.getElementById("awsc-panorama-bundle");
            var trackerConfiguration;
            // Excluding AWS Sign In from rate limit as they are handling loading tracker on their side
            var ignoreTrackerRateLimit = ["aws-signin"];
            // Config to have dynamic load rate for different app entity
            var trackerLoadRateConfig = {
                "aws-documentation": 1, // 100%
                "aws-marketing": 0.1, // 10%
                default: 0.1, // 10%
            };
            // Check if it is a canary traffic
            var isCanaryTraffic = getCookieByName("metrics-req-cat") === "canary";

            /**
             * Checks if current session is eligible for tracker rate limit based on App Entity value and return the load rate value
             */
            var getTrackerLoadRate = function (appEntity) {
                try {
                    var eligibleForTrackerLoadRate =
                        isProd && !ignoreTrackerRateLimit.includes(appEntity) && !isCanaryTraffic;
                    if (eligibleForTrackerLoadRate) {
                        return trackerLoadRateConfig[appEntity] || trackerLoadRateConfig["default"];
                    }
                    return 1;
                } catch (e) {
                    return 1;
                }
            };

            if (scriptTag && scriptTag.hasAttribute("data-config")) {
                var dataConfig = scriptTag.getAttribute("data-config");

                var parsedConfiguration;
                try {
                    parsedConfiguration = JSON.parse(dataConfig);
                } catch (e) {
                    // AWS Documentation is using XML format to inject scripts
                    // To make script tag XML complaint, double quotes inside data-config was changed to single quotes
                    // which is breaking JSON.parse
                    // Adding logic to convert single quotes back to double quotes and parse
                    dataConfig = dataConfig.replace(/'/g, '"');
                    parsedConfiguration = JSON.parse(dataConfig);
                }

                var appEntity = parsedConfiguration.appEntity ? parsedConfiguration.appEntity : "",
                    serviceId = parsedConfiguration.service ? parsedConfiguration.service : "",
                    regionCode = parsedConfiguration.region ? parsedConfiguration.region : "",
                    flags = parsedConfiguration.flags ? parsedConfiguration.flags : {},
                    trackerLoadRate = getTrackerLoadRate(appEntity); // knob to control how many customers can load the tracker script. Value should be between 0 and 1. Starting off with 0.1 (10% traffic) for Prod and 1 (100% traffic) for PreProd.

                // exit out if service ID, region, or appEntity are unavailable or if the service is denylisted
                if (!serviceId || !regionCode || !appEntity || denyListedServices.indexOf(serviceId) >= 0) {
                    console.warn(
                        // eslint-disable-next-line max-len
                        "Panorama could not be loaded. This could be due to incorrect configuration or because the service is denylisted."
                    );
                    return;
                }

                // Only load the tracker for a set percentage of users. By default, all users will load the tracker
                if (Math.random() > trackerLoadRate) {
                    return;
                }

                trackerConfiguration = {
                    appEntity: parsedConfiguration.appEntity,
                    console: false,
                    region: parsedConfiguration.region,
                    service: parsedConfiguration.service,
                    trackerConstants: {
                        ...defaultTrackerConstants,
                        flags,
                    },
                };
            }

            var defaultConfig = {
                appEntity: "aws-nonconsole",
                console: false,
                region: DEFAULT_NONCONSOLE_REGION,
                service: "non-console", // placeholder service ID if none is provided
                trackerConstants: defaultTrackerConstants,
            };

            initializePanoramaTracker(
                regionCode || defaultConfig.region,
                windowAlias,
                document,
                "script",
                getTrackerUrl(serviceId || defaultConfig.service, false),
                PANORAMA,
                null,
                null,
                trackerConfiguration || defaultConfig
            );
        } catch (e) {
            console.warn("Panorama:", e);
        }
    }

    /**
     * Utility function to provide the tracker URL to be used for the given service
     * @param {string} id - service ID
     * @param {boolean} isAwsConsole - is this an AWS console?
     * @returns the tracker URL corresponding to the service if there is an experimental URL or the default console URL; else, returns the default Shared CDN URL
     */
    // eslint-disable-next-line no-shadow
    function getTrackerUrl(id, isAwsConsole) {
        try {
            if (experimentalServices.indexOf(id) >= 0) {
                return experimentalTrackerUrl;
            }

            // Extract tracker CDN endpoint from data-url attr on the script tag.
            var trackerCdnUrlFromDataset = document.getElementById("awsc-panorama-bundle").getAttribute("data-url");

            if (isAwsConsole) {
                return trackerCdnUrlFromDataset;
            }

            // if tracker endpoint present in the data-url attr, use it else use the one in the init script.
            return trackerCdnUrlFromDataset || externalDefaultTrackerUrl;
        } catch (e) {
            console.warn("Panorama: No tracker URL found.");
        }
    }

    /**
     * Utility function to emit a custom event upon panorama load success or failure
     * @param isEnabled flag to emit with the custom event
     */
    function dispatchPanoramaLoadEvent(isEnabled) {
        try {
            var panoramaLoadEvent = document.createEvent("CustomEvent");
            panoramaLoadEvent.initCustomEvent("onPanoramaLoad", true, true, {
                enabled: isEnabled,
            });
            windowAlias.dispatchEvent(panoramaLoadEvent);

            if (!isEnabled) {
                windowAlias.panorama = function () {
                    console.warn("Panorama is not enabled; events will not be emitted.");
                    return undefined;
                };
                windowAlias.panorama.enabled = false;

                if (isAwsConsole) {
                    windowAlias.AWSC.Clog.bufferedQueue = [];
                }
            }
        } catch (e) {
            log("dispatchPanoramaLoadError", 1);
        }
    }

    /**
     * Gets the "content" attribute's value from meta tags with a specific name
     * @param {string} metaTagName - the "name" to look for in the document's meta tag
     * @returns the attribute value or null if none is not found
     */
    function getContentAttrFromMetaTag(metaTagName) {
        try {
            return document.head.querySelector("meta[name='" + metaTagName + "']").getAttribute("content");
        } catch (e) {
            return null;
        }
    }

    /**
     * This function is to load Panorama Tracker script.
     *
     * @param r Current region from ConsoleNavService
     * @param p The window
     * @param l The document
     * @param o "script", the tag name of script elements
     * @param w The source of the Panorama script. Make sure you get the latest version.
     * @param i The Panorama namespace. The Panorama user should set this.
     * @param n The new script (to be created inside the function)
     * @param g The first script on the page (to be found inside the function)
     * @param tc Tracker Configuration that is returned from the server
     */
    function initializePanoramaTracker(r, p, l, o, w, i, n, g, tc) {
        if (!p[i] || p[i].enabled) {
            p.GlobalSnowplowNamespace = p.GlobalSnowplowNamespace || [];
            p.GlobalSnowplowNamespace.push(i);
            p[i] = function () {
                (p[i].q = p[i].q || []).push(arguments);
            };
            p[i].q = p[i].q || [];
            p[i].trackCustomEvent = function () {
                [].unshift.call(arguments, "trackCustomEvent");
                p[i].apply(this, arguments);
            };

            p[i].loadTime = Date.now();
            p[i].enabled = true;
            n = l.createElement(o);
            g = l.getElementsByTagName(o)[0];
            n.onload = function () {
                if (p[i] && typeof p[i] === "function") {
                    p[i]("openOutqueue");
                }
                dispatchPanoramaLoadEvent(true);
            };
            n.onerror = function () {
                dispatchPanoramaLoadEvent(false);
            };
            n.async = 1;
            n.src = w;
            g.parentNode.insertBefore(n, g);
        }

        // Initialise panorama tracker
        windowAlias.panorama("newTracker", "cf", "https://" + r + LOG_ENDPOINT, tc);
    }
})();
