// Karma configuration GENERATED BY Bazel

const path = require('path');
const fs = require('fs');
const child_process = require('child_process');
const runfiles = require(process.env['BAZEL_NODE_RUNFILES_HELPER']);

// Static files are added to the files array but configured to not be included,
// so karma does not included them. Note that we need.
const STATIC_FILES = [
  // BEGIN STATIC FILES
  TMPL_static_files
  // END STATIC FILES
];

const BOOTSTRAP_FILES = [
  // BEGIN BOOTSTRAP FILES
  TMPL_bootstrap_files
  // END BOOTSTRAP FILES
];

// Test + runtime entry point files
const BUNDLE_FILES = findAllFiles('TMPL_test_bundle_dir');

// process.env.BUILD_WORKSPACE_DIRECTORY is set to the the absolute path of
// the bazel workspace when doing `bazel run ...`
// See https://docs.bazel.build/versions/master/user-manual.html#run
const isBazelRun = !!process.env.BUILD_WORKSPACE_DIRECTORY;

// Setup ibazel livereload when run with ibazel
const ibazelNotifyChanges = isBazelRun && !!process.env.IBAZEL_NOTIFY_CHANGES;

const VERBOSE_LOGS = !!process.env['VERBOSE_LOGS'];

function log_verbose(...m) {
  // This is a template file so we use __filename to output the actual filename
  if (VERBOSE_LOGS) console.error(`[${path.basename(__filename)}]`, ...m);
}

function findAllFiles(dir, subdir, found) {
  subdir = subdir || '.';
  found = found || [];

  const fullPath = runfiles.resolve(dir);

  for (const file of fs.readdirSync(fullPath)) {
    const filePath = dir + '/' + file;

    if (fs.statSync(runfiles.resolve(filePath)).isDirectory()) {
      findAllFiles(filePath, subdir, found);
    } else {
      found.push(filePath);
    }
  }

  return found;
}

/**
 * Helper function to merge base karma config values that are arrays.
 */
function mergeConfigArray(conf, name, values) {
  if (!conf[name]) {
    conf[name] = [];
  }
  values.forEach(v => {
    if (!conf[name].includes(v)) {
      conf[name].push(v);
    }
  })
}

/**
 * Helper function to find a particular namedFile
 * within the webTestMetadata webTestFiles
 */
function findNamedFile(webTestMetadata, key) {
  let result;
  webTestMetadata['webTestFiles'].forEach(entry => {
    const webTestNamedFiles = entry['namedFiles'];
    if (webTestNamedFiles && webTestNamedFiles[key]) {
      result = webTestNamedFiles[key];
    }
  });
  return result;
}

/**
 * Helper function to extract a browser archive
 * and return the path to extract executable
 */
function extractWebArchive(extractExe, archiveFile, executablePath) {
  try {
    // Paths are relative to the root runfiles folder
    extractExe = extractExe ? path.join('..', extractExe) : extractExe;
    archiveFile = path.join('..', archiveFile);
    const extractedExecutablePath = path.join(process.cwd(), executablePath);
    if (!extractExe) {
      throw new Error('No EXTRACT_EXE found');
    }
    child_process.execFileSync(
        extractExe, [archiveFile, '.'], {stdio: [process.stdin, process.stdout, process.stderr]});
    log_verbose(
        `Extracting web archive ${archiveFile} with ${extractExe} to ${extractedExecutablePath}`);
    return extractedExecutablePath;
  } catch (e) {
    console.error(`Failed to extract ${archiveFile}`);
    throw e;
  }
}

/**
 * Check if Chrome sandboxing is supported on the current platform.
 */
function supportChromeSandboxing() {
  if (process.platform === 'darwin') {
    // Chrome 73+ fails to initialize the sandbox on OSX when running under Bazel.
    // ```
    // ERROR [launcher]: Cannot start ChromeHeadless
    // ERROR:crash_report_database_mac.mm(96)] mkdir
    // /private/var/tmp/_bazel_greg/62ef096b0da251c6d093468a1efbfbd3/execroot/angular/bazel-out/darwin-fastbuild/bin/external/io_bazel_rules_webtesting/third_party/chromium/chromium.out/chrome-mac/Chromium.app/Contents/Versions/73.0.3683.0/Chromium
    // Framework.framework/Versions/A/new: Permission denied (13) ERROR:file_io.cc(89)]
    // ReadExactly: expected 8, observed 0 ERROR:crash_report_database_mac.mm(96)] mkdir
    // /private/var/tmp/_bazel_greg/62ef096b0da251c6d093468a1efbfbd3/execroot/angular/bazel-out/darwin-fastbuild/bin/external/io_bazel_rules_webtesting/third_party/chromium/chromium.out/chrome-mac/Chromium.app/Contents/Versions/73.0.3683.0/Chromium
    // Framework.framework/Versions/A/new: Permission denied (13) Chromium Helper[94642] <Error>:
    // SeatbeltExecServer: Failed to initialize sandbox: -1 Operation not permitted Failed to
    // initialize sandbox. [0213/201206.137114:FATAL:content_main_delegate.cc(54)] Check failed:
    // false. 0   Chromium Framework                  0x000000010c078bc9 ChromeMain + 43788137 1
    // Chromium Framework                  0x000000010bfc0f43 ChromeMain + 43035363
    // ...
    // ```
    return false;
  }

  if (process.platform === 'linux') {
    // Chrome on Linux uses sandboxing, which needs user namespaces to be enabled.
    // This is not available on all kernels and it might be turned off even if it is available.
    // Notable examples where user namespaces are not available include:
    // - In Debian it is compiled-in but disabled by default.
    // - The Docker daemon for Windows or OSX does not support user namespaces.
    // We can detect if user namespaces are supported via
    // /proc/sys/kernel/unprivileged_userns_clone. For more information see:
    // https://github.com/Googlechrome/puppeteer/issues/290
    // https://superuser.com/questions/1094597/enable-user-namespaces-in-debian-kernel#1122977
    // https://github.com/karma-runner/karma-chrome-launcher/issues/158
    // https://github.com/angular/angular/pull/24906
    try {
      const res = child_process.execSync('cat /proc/sys/kernel/unprivileged_userns_clone')
                      .toString()
                      .trim();
      return res === '1';
    } catch (error) {
    }
    return false;
  }

  return true;
}

/**
 * Helper function to override nested karma config values.
 */
function overrideNestedConfigValue(conf, name, value) {
  const nameParts = name.split('.');
  const finalName = nameParts.pop();
  for (const property of nameParts) {
    if (!(property in conf)) {
      conf[property] = {};
    }
    conf = conf[property];
  }
  if (conf.hasOwnProperty(name)) {
    console.warn(`Your karma configuration specifies '${name}' which will be overwritten by Bazel`);
  }
  conf[finalName] = value;
}

/**
 * Configuration settings for karma under Bazel common to karma_web_test
 * and karma_web_test_suite.
 */
function configureTestReporters(conf) {
  // Configure the junit reporter if the XML_OUTPUT_FILE environment is defined.
  const testOutputFile = process.env.XML_OUTPUT_FILE;
  if (testOutputFile) {
    mergeConfigArray(conf, 'plugins', []);

    mergeConfigArray(conf, 'reporters', ['junit']);


    overrideNestedConfigValue(conf, 'junitReporter.outputDir', path.dirname(testOutputFile));
    overrideNestedConfigValue(conf, 'junitReporter.outputFile', path.basename(testOutputFile));
    overrideNestedConfigValue(conf, 'junitReporter.useBrowserName', false);
  }
}

/**
 * Configure the 'files' and 'proxies' configuration attributes based on the
 * injected STATIC_FILES, BOOTSTRAP_FILES and BUNDLE_FILES.
 */
function configureFiles(conf) {
  // Static files available but not included
  STATIC_FILES.forEach(f => conf.files.push({pattern: f, included: false}));

  // Bootstrap files included before spec files
  BOOTSTRAP_FILES.forEach(f => conf.files.push(f));

  // Bundle files available to downloaded, included if non-chunk js files
  BUNDLE_FILES.forEach(f => {
    const isJs = f.endsWith('.js') || f.endsWith('.mjs');
    const isChunk = isJs && f.includes('chunk-');

    conf.files.push({
      pattern: f,
      type: isJs ? 'module' : undefined,
      included: isJs && !isChunk,
    });
  });

  // Proxy simple URLs to the bazel resolved files
  [...STATIC_FILES, ...BOOTSTRAP_FILES, ...BUNDLE_FILES].forEach(f => {
    // In Windows, the runfile will probably not be symlinked. Se we need to
    // serve the real file through karma, and proxy calls to the expected file
    // location in the runfiles to the real file.
    const resolvedFile = runfiles.resolve(f);

    // Prefixing the proxy path with '/absolute' allows karma to load local
    // files. This doesn't see to be an official API.
    // https://github.com/karma-runner/karma/issues/2703
    conf.proxies['/base/' + f] = '/absolute' + resolvedFile;
  })
}

/**
 * Configure karma when run under web_test_suite to use the test suite provided
 * browsers.
 */
function configureWebTestSuiteBrowsers(conf) {
  // If this is NOT invoked via a web_test_suite rule exist and assume configured elsewhere
  if (!process.env['WEB_TEST_METADATA']) {
    return;
  }

  const webTestMetadata = require(runfiles.resolve(process.env['WEB_TEST_METADATA']));

  log_verbose(`WEB_TEST_METADATA: ${JSON.stringify(webTestMetadata, null, 2)}`);

  if (webTestMetadata['environment'] === 'local') {
    const extractExe = findNamedFile(webTestMetadata, 'EXTRACT_EXE');
    webTestMetadata['webTestFiles'].forEach(webTestFiles => {
      const webTestNamedFiles = webTestFiles['namedFiles'];
      const archiveFile = webTestFiles['archiveFile'];

      // When karma is configured to use Chrome it will look for a CHROME_BIN
      // environment variable.
      if (archiveFile) {
        process.env.CHROME_BIN =
            extractWebArchive(extractExe, archiveFile, webTestNamedFiles['CHROMIUM']);
      } else {
        try {
          process.env.CHROME_BIN = runfiles.resolve(webTestNamedFiles['CHROMIUM']);
        } catch {
          // Fail as this file is expected to be in runfiles
          throw new Error(`Failed to resolve rules_webtesting Chromium binary '${
              webTestNamedFiles['CHROMIUM']}' in runfiles`);
        }
      }
      // Read any additional chrome options (as specified by the
      // rules_webtesting manifest).
      const chromeOptions = (webTestMetadata['capabilities'] || {})['goog:chromeOptions'];
      const additionalArgs = (chromeOptions ? chromeOptions['args'] : []).filter(arg => {
        // We never want to 'run' Chrome in headless mode.
        return arg != '--headless';
      });
      const browser = process.env['DISPLAY'] ? 'Chrome' : 'ChromeHeadless';
      if (!supportChromeSandboxing()) {
        const launcher = 'CustomChromeWithoutSandbox';
        conf.customLaunchers =
            {[launcher]: {base: browser, flags: ['--no-sandbox', ...additionalArgs]}};
        conf.browsers.push(launcher);
      } else {
        const launcher = 'CustomChrome';
        conf.customLaunchers = {[launcher]: {base: browser, flags: additionalArgs}};
        conf.browsers.push(launcher);
      }
    });
  } else {
    throw new Error(`Unknown WEB_TEST_METADATA environment '${webTestMetadata['environment']}'`);
  }

  if (!conf.browsers.length) {
    throw new Error('No browsers configured in web test suite');
  }
}

function configureBazelTestBrowsers(conf) {
  // If this is invoked via a web_test_suite rule exist and assume configured elsewhere
  if (process.env['WEB_TEST_METADATA']) {
    return;
  }

  // Fallback to using the system local chrome if no valid browsers have been
  // configured above
  if (!conf.browsers || !conf.browsers.length) {
    console.warn('No browsers configured. Configuring Karma to use system Chrome.');
    conf.browsers = [process.env['DISPLAY'] ? 'Chrome' : 'ChromeHeadless'];
  }
}

function configureFormatError(conf) {
  conf.formatError = (msg) => {
    // This is a bazel specific formatError that removes the workspace
    // name from stack traces.
    // Look for filenames of the format "(<filename>:<row>:<column>"
    const FILENAME_REGEX = /\(([^:\n\r]+)(:\d+:\d+)/gm;
    msg = msg.replace(FILENAME_REGEX, (_, p1, p2) => {
      if (p1.startsWith('../')) {
        // Remove all leading "../"
        while (p1.startsWith('../')) {
          p1 = p1.substr(3);
        }
      } else {
        // Remove workspace name(angular, ngdeps etc.) from the beginning.
        const index = p1.indexOf('/');
        if (index >= 0) {
          p1 = p1.substr(index + 1);
        }
      }
      return '(' + p1 + p2;
    });
    return msg + '\n\n';
  };
}

module.exports = function(config) {
  const conf = {
    basePath: 'TMPL_runfiles_path',

    colors: true,
    logLevel: VERBOSE_LOGS ? config.LOG_DEBUG : config.LOG_INFO,

    frameworks: ['jasmine'],
    reporters: isBazelRun ? [] : ['progress'],
    plugins: [
      require('karma-chrome-launcher'), require('karma-jasmine'),
      require('karma-sourcemap-loader'), require('karma-junit-reporter')
    ],

    preprocessors: {
      '**/*.js': ['sourcemap'],
    },

    concurrency: Infinity,

    // When doing `bazel run ...` we want karma to continue running, where when
    // doing `bazel test ...` it can run once and close right away.
    singleRun: !isBazelRun,

    // watch the files when using ibazel
    autoWatch: ibazelNotifyChanges,

    // Disable 'strict-origin-when-cross-origin' to allow external scripts for livereload
    crossOriginAttribute: !ibazelNotifyChanges,

    // Configured based on bazel web/testing setup
    browsers: [],

    // Configured based on bazel file inputs
    // Include the ibazel livereload script at the start when available
    files: process.env.IBAZEL_LIVERELOAD_URL ? [process.env.IBAZEL_LIVERELOAD_URL] : [],

    // configured based on bazel file inputs
    proxies: [],
  };

  configureTestReporters(conf);
  configureFiles(conf);
  configureFormatError(conf);

  // Do not configure browsers for a `bazel run` and allow manually opening the browser
  // for debugging.
  if (!isBazelRun) {
    configureWebTestSuiteBrowsers(conf);
    configureBazelTestBrowsers(conf);
  }

  log_verbose(`karma configuration: ${JSON.stringify(conf, null, 2)}`);

  config.set(conf);
}
