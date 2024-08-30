const {
  dialogflow,
  actionssdk,
  Image,
  Table,
  Carousel,
} = require('actions-on-google');
const { asyncHandler } = require('../middleware');

const app = dialogflow({
  debug: true,
});
/**
  @desc   Post Smarthome Webhook
  @param  accessToken
  @method GET
  @route  /api/v1/google_home/webhook
  @access Private
*/

exports.smartHomeWebhook = asyncHandler(async (req, res, _) => {
  // app.onSync((body, headers) => {
  //   console.log({ body, headers });
  //   // Handle SYNC intent logic here
  //   const devices = [
  //     {
  //       id: '123',
  //       type: 'action.devices.types.OUTLET',
  //       traits: ['action.devices.traits.OnOff'],
  //       name: {
  //         defaultNames: ['My Outlet 1234'],
  //         name: 'Night light',
  //         nicknames: ['wall plug'],
  //       },
  //       willReportState: false,
  //       roomHint: 'kitchen',
  //       deviceInfo: {
  //         manufacturer: 'lights-out-inc',
  //         model: 'hs1234',
  //         hwVersion: '3.2',
  //         swVersion: '11.4',
  //       },
  //       otherDeviceIds: [
  //         {
  //           deviceId: 'local-device-id',
  //         },
  //       ],
  //       customData: {
  //         fooValue: 74,
  //         barValue: true,
  //         bazValue: 'foo',
  //       },
  //     },
  //     {
  //       id: '456',
  //       type: 'action.devices.types.LIGHT',
  //       traits: [
  //         'action.devices.traits.OnOff',
  //         'action.devices.traits.Brightness',
  //         'action.devices.traits.ColorSetting',
  //       ],
  //       name: {
  //         defaultNames: ['lights out inc. bulb A19 color hyperglow'],
  //         name: 'lamp1',
  //         nicknames: ['reading lamp'],
  //       },
  //       willReportState: false,
  //       roomHint: 'office',
  //       attributes: {
  //         colorModel: 'rgb',
  //         colorTemperatureRange: {
  //           temperatureMinK: 2000,
  //           temperatureMaxK: 9000,
  //         },
  //         commandOnlyColorSetting: false,
  //       },
  //       deviceInfo: {
  //         manufacturer: 'lights out inc.',
  //         model: 'hg11',
  //         hwVersion: '1.2',
  //         swVersion: '5.4',
  //       },
  //       customData: {
  //         fooValue: 12,
  //         barValue: false,
  //         bazValue: 'bar',
  //       },
  //     },
  //   ]; // Retrieve devices from your smart home system
  //   return {
  //     requestId: body.requestId,
  //     payload: {
  //       agentUserId: 'user-id', // Unique identifier for the user
  //       devices,
  //     },
  //   };
  // });
});

// // Register a QUERY intent handler
// app.onQuery((body, headers) => {
//   // Handle QUERY intent logic here
//   const deviceStates = {}; // Object to store device states

//   // Populate deviceStates with the current state of devices

//   return {
//     requestId: body.requestId,
//     payload: {
//       devices: deviceStates,
//     },
//   };
// });

// // Register an EXECUTE intent handler
// app.onExecute((body, headers) => {
//   // Handle EXECUTE intent logic here
//   const commands = body.inputs[0].payload.commands;

//   // Process the commands and perform actions on devices

//   return {
//     requestId: body.requestId,
//     payload: {
//       commands: [
//         {
//           ids: [], // IDs of the devices affected by the command
//           status: 'SUCCESS', // Status of the command execution
//           states: {}, // Optional new states of the devices
//         },
//       ],
//     },
//   };
// });

// // Register an DISCONNECT intent handler
// app.onDisconnect((body, headers) => {
//   // Handle DISCONNECT intent logic here

//   return {};
// });
