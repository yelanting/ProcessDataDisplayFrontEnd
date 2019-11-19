export function getList() {
  return {
    data: {
      items: [
        {
          id: 1,
          team: 'team1',
          bugs: 0,
          addTestCase: 0,
          executeCase: 0,
          addAutoTestCase: 0,
          children: [
            {
              id: 1,
              name: 'sunliuping1',
              bugs: 40,
              addTestCase: 400,
              executeCase: 900,
              addAutoTestCase: 10
            },
            {
              id: 2,
              name: 'sunliuping2',
              bugs: 41,
              addTestCase: 400,
              executeCase: 901,
              addAutoTestCase: 11
            }
          ]
        },
        {
          id: 2,
          team: 'team2',
          bugs: 0,
          addTestCase: 0,
          executeCase: 0,
          addAutoTestCase: 0,
          children: [
            {
              id: 1,
              name: 'sunliuping1',
              bugs: 40,
              addTestCase: 400,
              executeCase: 900,
              addAutoTestCase: 10
            },
            {
              id: 2,
              name: 'sunliuping2',
              bugs: 41,
              addTestCase: 400,
              executeCase: 901,
              addAutoTestCase: 11
            }
          ]
        }
      ]
    },
    success: true
  }
}
