# Serves the static demo that GitHub Pages publishes.
#
# docs/ is generated from the tested sources by `npm run build:demo`, and CI
# fails when the committed copy is out of date, so this image ships exactly the
# plugin code that the test suite and the coverage gate passed on.
FROM nginx:1.27-alpine

COPY docs/ /usr/share/nginx/html/

# busybox wget is already part of the alpine image, so the health check adds no
# package and no extra network call to the built image.
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
	CMD wget --quiet --spider http://127.0.0.1/ || exit 1

EXPOSE 80
