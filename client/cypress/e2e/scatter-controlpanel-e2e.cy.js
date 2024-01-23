import dayjs from 'dayjs';

describe('WeFly Application Launch and Initial Display', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
    cy.get('.MuiCircularProgress-root').should('be.visible');
    cy.get('#track-list-body').find('tr', { timeout: 10000 }).should('have.length', 122);
    cy.get('.MuiCircularProgress-root').should('not.be.visible');
  });

  it('successfully loads and displays the initial ScatterMode with correct track count', () => {
    cy.get('#cesium').invoke('css', 'z-index', '10000');
    cy.get('#cesium').should('be.visible')
    cy.get('#cesium').invoke('css', 'z-index', '-1');
    cy.get('#control-panel').should('be.visible')
    cy.get('#tracklist-container').should('be.visible')
    cy.get('#date-picker-container').find('.MuiInputBase-input').should('have.value', dayjs(new Date()).format('YYYY-MM-DD (ddd)')) // 現在の日付である

    // TrackListの件数を確認
    cy.get('#track-list-body').find('tr', { timeout: 10000 }).should('have.length', 122)
    cy.get('#tracknumber-label').should('have.text', '122 tracks')

    // TrackListのオーダーを確認
    cy.get('#track-list-body').find('tr').eq(0).find('td').eq(1).should('have.text', 'Hken')
    cy.get('#track-list-body').find('tr').eq(1).find('td').eq(1).should('have.text', 'tmai24')
    cy.get('#track-list-body').find('tr').eq(2).find('td').eq(1).should('have.text', 'nabekatsu')
  });

  it('should toggle the ControlPanel visibility on button click', () => {
    cy.get('#control-panel').should('be.visible');

    cy.get('#control-panel-toggle svg').click();
    cy.get('#control-panel').should('not.be.visible');

    cy.get('#control-panel-toggle svg').click();
    cy.get('#control-panel').should('be.visible');
  });

  const sortCondition = [
    {
      column: 'activity',
      expected1: [
        { row: 0, col: 0, text: 'Flex wing FAI1', },
        { row: 15, col: 0, text: 'General', },
        { row: 16, col: 0, text: 'Glider', },
      ],
      expected2: [
        { row: 0, col: 0, text: 'Rigid wing FAI5', },
        { row: 4, col: 0, text: 'Paraglider', },
        { row: 121, col: 0, text: 'Flex wing FAI1', },
      ]
    },
    {
      column: 'pilotname',
      expected1: [
        { row: 0, col: 1, text: '2696raichou', },
        { row: 1, col: 1, text: 'AAA', },
        { row: 2, col: 1, text: 'airheartmitsui', },
      ],
      expected2: [
        { row: 0, col: 1, text: 'Yukorin', },
        { row: 3, col: 1, text: 'yukihiro', },
        { row: 4, col: 1, text: 'YOKOH', },
      ]
    },
    {
      column: 'area',
      expected1: [
        { row: 0, col: 2, text: ' Asagiri -DK Skyg...', },
        { row: 4, col: 2, text: ' Asagiri Inogashi...', },
        { row: 121, col: 2, text: '', },
      ],
      expected2: [
        { row: 0, col: 2, text: '', },
        { row: 12, col: 2, text: 'SPK (NE +SW) Oogo...', },
        { row: 13, col: 2, text: ' Tanzawa Bodai', },
      ]
    },
    {
      column: 'starttime',
      expected1: [
        { row: 0, col: 3, text: '15:45:16', },
        { row: 1, col: 3, text: '14:56:59', },
        { row: 2, col: 3, text: '14:48:17', },
      ],
      expected2: [
        { row: 0, col: 3, text: '09:31:29', },
        { row: 1, col: 3, text: '09:32:32', },
        { row: 2, col: 3, text: '09:39:43', },
      ],
    },
    {
      column: 'duration',
      expected1: [
        { row: 0, col: 4, text: '3 h 57 m', },
        { row: 1, col: 4, text: '3 h 56 m', },
        { row: 2, col: 4, text: '3 h 50 m', },
      ],
      expected2: [
        { row: 0, col: 4, text: '0 h 7 m', },
        { row: 1, col: 4, text: '0 h 8 m', },
        { row: 2, col: 4, text: '0 h 11 m', },
      ],
    },
    {
      column: 'maxalt',
      expected1: [
        { row: 0, col: 5, text: '2569m', },
        { row: 1, col: 5, text: '2386m', },
        { row: 2, col: 5, text: '2372m', },
      ],
      expected2: [
        { row: 0, col: 5, text: '0m', },
        { row: 1, col: 5, text: '0m', },
        { row: 2, col: 5, text: '0m', },
      ],
    },
    {
      column: 'distance',
      expected1: [
        { row: 0, col: 6, text: '63.2km', },
        { row: 1, col: 6, text: '31.6km', },
        { row: 2, col: 6, text: '30km', },
      ],
      expected2: [
        { row: 0, col: 6, text: '0km', },
        { row: 1, col: 6, text: '0km', },
        { row: 2, col: 6, text: '0km', },
      ],
      scrollRight: true,
    },
  ]
  sortCondition.forEach((condition) => {
    it(`sorts by ${condition.column} correctly`, () => {
      cy.get(`#track-list-header .${condition.column} .label-text`).should('be.visible').click();

      // 昇順ソートの確認
      condition.expected1.forEach((expected) => {
        cy.get(`#track-list-body tr`).eq(expected.row).find('td').eq(expected.col).should('have.text', expected.text);
      });

      cy.get(`#track-list-header .${condition.column} .label-text`).should('be.visible').click();

      // 降順
      condition.expected2.forEach((expected) => {
        cy.get(`#track-list-body tr`).eq(expected.row).find('td').eq(expected.col).should('have.text', expected.text);
      });
    });
  });

  const filterCondition = [
    {
      column: 'area',
      expected:
        { number: 4, col: 2, text: ' Asagiri -DK Skyg...', },
    },
    {
      column: 'activity',
      expected:
        { number: 15, col: 0, text: 'Flex wing FAI1', },
    },
    {
      column: 'pilotname',
      expected:
        { number: 1, col: 1, text: '2696raichou', },
    },
  ];
  filterCondition.forEach((condition) => {
    it(`filters tracks by a single filter ${condition.column}`, () => {
      cy.get(`#trackfilter-icon-${condition.column}`).click();
      cy.get('[role=dialog]').should('be.visible');
      cy.get('#trackfilter-list li').eq(0).click();
      cy.get('[role=dialog] button').click();

      cy.get('#track-list-body tr').should('have.length', condition.expected.number);
      cy.get('#track-list-body').find('tr').each((row) => {
        cy.wrap(row).find('td').eq(condition.expected.col).should('have.text', condition.expected.text);
      });

      cy.get(`#trackfilter-icon-${condition.column} svg`).should('have.css', 'color', 'rgb(233, 88, 0)');

      // unfilter
      cy.get(`#trackfilter-icon-${condition.column}`).click();
      cy.get('[role=dialog]').should('be.visible');
      cy.get('#trackfilter-list li').eq(0).click();
      cy.get('[role=dialog] button').click();

      cy.get('#track-list-body tr').should('have.length', 122);

      cy.get(`#trackfilter-icon-${condition.column} svg`).should('have.css', 'color', 'rgba(0, 0, 0, 0.54)');
    });
  });

  it('filters tracks by multiple filters', () => {
    cy.get(`#trackfilter-icon-area`).click();
    cy.get('[role=dialog]').should('be.visible');
    cy.get('#trackfilter-list li').eq(4).click(); // Ashio West
    cy.get('[role=dialog] button').click();

    cy.get(`#trackfilter-icon-activity`).click();
    cy.get('[role=dialog]').should('be.visible');
    cy.get('#trackfilter-list li').eq(0).click(); // Flex wing FAI1
    cy.get('[role=dialog] button').click();

    cy.get('#track-list-body tr').should('have.length', 7);
    cy.get('#track-list-body').find('tr').each((row) => {
      cy.wrap(row).find('td').eq(0).should('have.text', 'Flex wing FAI1');
      cy.wrap(row).find('td').eq(2).should('have.text', ' Ashio West');
    });
  });

  it('change date', () => {
    // 2024-01-10を選択
    cy.get(`#date-picker-container button`).click();
    cy.contains('.MuiPickersLayout-root button', "10").click();

    cy.get('#track-list-body').find('tr', { timeout: 10000 }).should('have.length', 12);
    cy.get('.MuiCircularProgress-root').should('not.be.visible');

    // 2024-01-11を選択
    cy.get(`#date-picker-container button`).click();
    cy.contains('.MuiPickersLayout-root button', "11").click();

    cy.get('#track-list-body').find('tr', { timeout: 10000 }).should('have.length', 0);
    cy.get('.MuiCircularProgress-root').should('not.be.visible');
  });
});
