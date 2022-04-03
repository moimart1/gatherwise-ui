import { langEnum, localize } from '../localization'

test('Should return french traduction of "english" word', async () => {
  expect(localize('english')(langEnum.fr)).toEqual('Anglais')
  expect(localize('english')(langEnum.fr, { capitalize: false })).toEqual(
    'anglais'
  )
})

test('Should return english version of unknown word', async () => {
  expect(localize('TEST doesnt exist')(langEnum.fr)).toEqual(
    'TEST doesnt exist'
  )
})

test("Should return english version even if explicit traduction doesn't exist", async () => {
  expect(localize('french')(langEnum.en)).toEqual('French')
})
