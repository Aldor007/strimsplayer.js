

# start selenium

#if protractor is local
#./node_modules/protractor/bin/webdriver-manager start > /dev/null 2>&1 &

#if protractor is global
webdriver-manager start > /dev/null 2>&1 &

# wait until selenium is up
while ! curl http://localhost:4444/wd/hub/status &>/dev/null; do :; done

#run functional tests
echo "Running functional tests"
protractor tests/functional/conf.js

# stop selenium
curl -s -L http://localhost:4444/selenium-server/driver?cmd=shutDownSeleniumServer > /dev/null 2>&1

#run unit tests
echo "Running unit tests"
jasmine-node tests/unit/
