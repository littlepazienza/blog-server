FROM rust as builder
USER root
COPY ./ ./
RUN rustup toolchain install nightly-2022-04-18
RUN rustup run nightly-2022-04-18 cargo -V
RUN rustup run nightly-2022-04-18 cargo test
RUN rustup run nightly-2022-04-18 cargo build
RUN mkdir -p /var/blog-images
RUN echo "## Images Directory" > /var/blog-images/README.md

FROM gcr.io/distroless/cc 
COPY --from=builder ./target/debug/blog-server ./blog-server
COPY --from=builder ./var/blog-images/README.md ./var/blog-images/README.md
CMD ["./blog-server ./var/blog-images"]
