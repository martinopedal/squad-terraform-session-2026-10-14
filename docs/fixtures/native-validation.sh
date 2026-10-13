#!/bin/sh
set -eu
test "$((17+25))" -eq 42
test "$(printf '%s' native-squad | tr '[:lower:]' '[:upper:]')" = NATIVE-SQUAD
fixture_sha=$(printf '%s' native-squad-fixture | sha256sum | cut -d ' ' -f 1)
test "$fixture_sha" = 876992e30f1faa6aed4173668899823cf04362c5853ad50baa138e756a8bb68f
source_sha=$(sha256sum /root/native-validation.sh | cut -d ' ' -f 1)
printf '{"schema":"native-squad-validation-v1","checks":{"arithmetic":true,"uppercase":true,"fixtureHash":true},"fixtureSha256":"%s","sourceSha256":"%s"}\n' "$fixture_sha" "$source_sha" > /root/native-result.json
cat /root/native-result.json
printf 'RESULT_SHA256=%s\n' "$(sha256sum /root/native-result.json | cut -d ' ' -f 1)"
