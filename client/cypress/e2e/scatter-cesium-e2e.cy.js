describe('WeFly Application Launch and Initial Display', () => {
    const tracknumber = 122;

    beforeEach(() => {
        cy.visit('http://localhost:3000');
        cy.get('.MuiCircularProgress-root').should('be.visible');
        cy.get('#track-list-body').find('tr', { timeout: 10000 }).should('have.length', tracknumber);
        cy.get('.MuiCircularProgress-root').should('not.be.visible');
    });

    it('displays track groups', () => {
        cy.window().then((win) => {
            const cesiumViewer = win.cesiumViewer;
            expect(cesiumViewer).to.not.be.undefined;

            cy.wrap(null).should(() => {
                const billboards = cesiumViewer.entities.values.filter(e => e.billboard);
                expect(billboards.length).to.equal(19);

                // billboard entityの画像がtrack_group_pin.svgであることを確認
                billboards.forEach((billboard) => {
                    expect(billboard.billboard.image.getValue()).to.include('track_group_pin.svg');
                    expect(billboard.show).to.be.true;
                });
            });
        });
    });

    it('interacts with TrackGroup icon and checks the changes', () => {
        cy.get('#control-panel-toggle').click();
        cy.get('#control-panel').should('not.be.visible');

        cy.window().then((win) => {
            const cesiumViewer = win.cesiumViewer;

            let initialCameraHeight;
            cy.wrap(null).should(() => {
                const billboards = cesiumViewer.entities.values.filter(e => e.billboard);
                expect(billboards.length).to.equal(19);
                win.selectTrackGroup(3);
            }).then(() => {
                initialCameraHeight = cesiumViewer.camera.positionCartographic.height;
            })
            cy.wrap(null).should(() => {
                const currentCameraHeight = cesiumViewer.camera.positionCartographic.height;
                expect(currentCameraHeight).to.be.below(initialCameraHeight);
            })
            cy.wrap(null).should(() => {
                const currentCameraHeight = cesiumViewer.camera.positionCartographic.height;
                // PointGraphics Entityの確認
                const pointGraphicsEntities = cesiumViewer.entities.values.filter(e => e.point && e.show);
                expect(pointGraphicsEntities.length).to.equal(9880);
            })
            cy.wrap(null).should(() => {
                const polylineGraphicsEntities = cesiumViewer.entities.values.filter(e => e.polyline && !e.show);
                expect(polylineGraphicsEntities.length).to.equal(tracknumber);
            })
            cy.wrap(null).should(() => {
                const billboardEntities = cesiumViewer.entities.values.filter(e => e.billboard && !e.show);
                expect(billboardEntities.length).to.equal(19);
            });
        });
    });

    it('TrackPoint click', () => {
        cy.get('#control-panel-toggle').click();
        cy.get('#control-panel').should('not.be.visible');

        cy.window().then((win) => {
            const cesiumViewer = win.cesiumViewer;

            cy.wrap(null).should(() => {
                const billboards = cesiumViewer.entities.values.filter(e => e.billboard);
                expect(billboards.length).to.equal(19);
            }).then(() => {
                win.selectTrackGroup(0);
            })
            cy.wrap(null).should(() => {
                const currentCameraHeight = cesiumViewer.camera.positionCartographic.height;
                expect(currentCameraHeight).to.below(70000);
            }).then(() => {
                win.selectTrackPoint(80);
            })
            cy.wrap(null).should(() => {
                const polylineGraphicsEntities = cesiumViewer.entities.values.filter(e => e.polyline && e.show);
                expect(polylineGraphicsEntities.length).to.equal(1);
            });
        });
    });

    it('TrackList select', () => {
        let trackid;
        cy.get('#track-list-body').find('tr').eq(0).click().invoke('attr', 'id').then((id) => {
            trackid = id.replace('trackrow-', '');
        });
        cy.get('#track-list-body').find('tr').eq(0).should('have.css', 'background-color', 'rgba(0, 255, 0, 0.6)');

        cy.window().then((win) => {
            const cesiumViewer = win.cesiumViewer;

            cy.wrap(null).should(() => {
                const billboards = cesiumViewer.entities.values.filter(e => e.billboard && !e.show);
                expect(billboards.length).to.equal(19);
            })
            cy.wrap(null).should(() => {
                const currentCameraHeight = cesiumViewer.camera.positionCartographic.height;
                expect(currentCameraHeight).to.below(70000);
            })
            cy.wrap(null).should(() => {
                const currentCameraHeight = cesiumViewer.camera.positionCartographic.height;
                // PointGraphics Entityの確認
                const pointGraphicsEntities = cesiumViewer.entities.values.filter(e => e.point && e.show);
                expect(pointGraphicsEntities.length).to.equal(9880);
            })
            cy.wrap(null).should(() => {
                const polylineGraphicsEntities = cesiumViewer.entities.values.filter(e => e.polyline && e.show);
                expect(polylineGraphicsEntities.length).to.equal(1);
                expect(polylineGraphicsEntities[0].id).to.equal(`trackline-${trackid}`);
            });

        });

        // 選択解除
        cy.get('#track-list-body').find('tr').eq(0).click();
        cy.window().then((win) => {
            const cesiumViewer = win.cesiumViewer;
            cy.wrap(null).should(() => {
                const polylineGraphicsEntities = cesiumViewer.entities.values.filter(e => e.polyline && e.show);
                expect(polylineGraphicsEntities.length).to.equal(0);
            });
        });
        cy.get('#track-list-body').find('tr').eq(0).should('have.css', 'background-color', 'rgba(0, 0, 0, 0)');
    });

    it.only('Date change', () => {
        cy.get(`#date-picker-container button`).click();
        cy.contains('.MuiPickersLayout-root button', "10").click();

        cy.get('#track-list-body').find('tr', { timeout: 10000 }).should('have.length', 12);

        cy.window().then((win) => {
            const cesiumViewer = win.cesiumViewer;

            cy.wrap(null).should(() => {
                const billboards = cesiumViewer.entities.values.filter(e => e.billboard);
                expect(billboards.length).to.equal(4);
            });
        });
    });
});