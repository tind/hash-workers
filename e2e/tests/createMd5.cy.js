describe("Tests createMd5", () => {
    before(() => {
        cy.visit("tests.html");
    });

    const cases = [
        ["foo", new Uint8Array([ 102, 111, 111 ]), "acbd18db4cc2f85cedef654fccc4a4d8"],
    ];

    for (const [name, blob, expectation] of cases) {
        it(`Correctly calculates checksum of ${name}`, () => {
            cy.window().then((window) => {
                return new window.Promise((resolve, reject) => {
                    const worker = new window.Worker("dist/createMd5.js");
                    worker.onmessage = (ev) => {
                        if (ev.data.type === "READY") {
                            worker.postMessage({ type: "UPDATE", data: blob });
                            worker.postMessage({ type: "DIGEST" });
                        } else if (ev.data.type === "DIGEST_RESULT") {
                            resolve(ev.data.data);
                        } else if (ev.data.type === "ERROR") {
                            reject(`Got error: ${ev.data.data}`);
                        } else {
                            reject(`Got unexpected message: ${JSON.stringify(ev.data)}`);
                        }
                    };
                });
            })
            .should("eq", expectation);
        });
    }
});
