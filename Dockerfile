FROM rust as blog-server
USER root
COPY ./ ./
RUN rustup toolchain install nightly-2022-04-18
RUN rustup run nightly-2022-04-18 cargo -V
RUN rustup run nightly-2022-04-18 cargo test
RUN rustup run nightly-2022-04-18 cargo build