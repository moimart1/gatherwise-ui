export function mockApiAuthentications({ mockRequest }) {
  mockRequest.onPost(new RegExp('.*/authentications/broker/token')).reply(200, {
    access_token: 'TESTbrokerToken==',
  })
}
