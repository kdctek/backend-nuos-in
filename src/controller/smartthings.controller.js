/* eslint-disable prefer-destructuring */
/* eslint-disable no-multi-assign */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-shadow */
/* eslint-disable block-scoped-var */
/* eslint-disable vars-on-top */
/* eslint-disable no-var */
/* eslint-disable no-eval */
/* eslint-disable no-plusplus */
/* eslint-disable prefer-const */
/* eslint-disable radix */
/* eslint-disable no-unsafe-optional-chaining */
const axios = require('axios');
const { SchemaConnector, DeviceErrorTypes } = require('st-schema');

const deviceStates = { switch: 'off', level: 100 };
const allowedModuleType = [1, 6, 20];
const dimmableDeviceTypes = [6, 7, 8, 9, 10, 43];
const rangeControlledDeviceTypes = [6];
const displayCategories = {
  1: 'SWITCH',
  18: 'SWITCH',
  43: 'THERMOSTAT',
  44: 'SWITCH',
  21: 'SWITCH',
  22: 'SWITCH',
  24: 'SWITCH',
  25: 'SWITCH',
  2: 'LIGHT',
  3: 'LIGHT',
  4: 'LIGHT',
  7: 'LIGHT',
  8: 'LIGHT',
  9: 'LIGHT',
  17: 'SWITCH',
  19: 'SMARTPLUG',
  23: 'TV',
  6: 'SWITCH',
};
async function fetchItems(gateways) {
  const promises = [];
  if (gateways) {
    for (const gateway of gateways) {
      const result = await axios
        .get(
          `https://8a346zakk7.execute-api.ap-southeast-1.amazonaws.com/prod/NUOSAPPDeviceAndSceneNamesDB/${gateway?.id}`,
          {
            headers: {
              'x-api-key': 'FJssllekan84rX7yKTmhP5Tdi9YIwacm69G5MCTv',
            },
          },
        )
        .then((response) => response.data)
        .catch((error) => {
          console.error('Error:', error);
        });
      promises.push({
        items: result['body-json'].Items,
        gatewayId: gateway?.id,
      });
    }
  }
  const results = await Promise.all(promises);
  return results;
}

async function callParticleAPI(gatewayId, accessToken, command, resp = true) {
  // ctrl/room_id*mudule_id@device_id,DC!
  const params = new URLSearchParams();
  params.append('data', command);
  await axios
    .post(`https://api.particle.io/v1/devices/${gatewayId}/TRANSMIT`, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        authorization: `Bearer ${accessToken}`,
      },
    })
    .then((res) => res?.data)
    .catch((err) => console.log('====Error====', err?.message));
}

async function callSceneFunction(
  gatewayId,
  accessToken,
  onCommand,
  offCommand,
  name,
) {
  const params = new URLSearchParams();
  params.append('data', name === 'on' ? `alon/$${onCommand}!` : offCommand);

  await axios
    .post(`https://api.particle.io/v1/devices/${gatewayId}/TRANSMIT`, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        authorization: `Bearer ${accessToken}`,
      },
    })
    .then((res) => res?.data)
    .catch((err) => console.log('====Error====', err));
}

async function getCurrentState(gatewayId, room, module, device, accessToken) {
  let power;
  let brightness;
  let range;
  const command = `ctrl/${room}*${module}@${device},${0}!`;
  const params = new URLSearchParams();
  params.append('data', command);
  const currentState = await axios
    .post(
      `https://api.particle.io/v1/devices/${gatewayId}/CURR_STATE`,
      params,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          authorization: `Bearer ${accessToken}`,
        },
      },
    )
    .then((res) => res?.data)
    .catch((err) => console.log('====Error====', err));

  if (currentState?.return_value === 0) {
    power = 'OFF';
  } else power = 'ON';
  if (currentState?.return_value === 80) {
    range = 1;
  } else if (currentState?.return_value === 102) {
    range = 2;
  } else if (currentState?.return_value === 142) {
    range = 3;
  } else if (currentState?.return_value === 255) {
    range = 4;
  }
  brightness = parseInt(((currentState?.return_value / 255) * 100).toFixed(3));
  return { power, brightness, range };
}
exports.connector = new SchemaConnector()
  .enableEventLogging(2)
  .discoveryHandler(async (accessToken, response) => {
    const result = await axios
      .get(`https://api.particle.io/v1/devices/?access_token=${accessToken}`)
      .then((response) => response?.data)
      .catch((error) => {
        console.error(error);
      });
    const data = await fetchItems(result);

    for (let a = 0; a < data?.length; a++) {
      const { items } = data[a];
      const { gatewayId } = data[a];
      for (let i = 0; i < items.length; i++) {
        if (
          parseInt(items[i].roomID.S) >= 0 &&
          parseInt(items[i].roomID.S) <= 20 &&
          items[i].deviceNamesJSON.S !== 'Empty' &&
          items[i].sceneNamesJSON.S !== 'Empty'
        ) {
          const device = eval(`(${items[i].deviceNamesJSON.S})`)[0];
          const scenes = eval(`(${items[i].sceneNamesJSON.S})`)[0];

          if (device) {
            for (let j = 0; j < device.RS.length; j++) {
              if (
                allowedModuleType.indexOf(device.RS[j].MT) >= 0 &&
                device.RS[j].D.length > 0
              ) {
                for (let k = 0; k <= device.RS[j].DT.length; k++) {
                  if (
                    device.RS[j].DT[k] > 0 &&
                    !/Device/i.test(device.RS[j].D[k])
                  ) {
                    const deviceId = k + 1;
                    if (
                      dimmableDeviceTypes.indexOf(device.RS[j].DT[k]) >= 0 &&
                      !device.RS[j].D[k].includes('Fan')
                    ) {
                      var caps = 'c2c-dimmer';
                    } else if (
                      rangeControlledDeviceTypes.indexOf(device.RS[j].DT[k]) >=
                        0 &&
                      device.RS[j].D[k].includes('Fan')
                    ) {
                      caps = 'c2c-fan-controller-4speed';
                    } else caps = 'c2c-dimmer-power-energy';
                    const dc =
                      device.RS[j].DT[k] in displayCategories
                        ? [displayCategories[device.RS[j].DT[k]]]
                        : ['OTHER'];

                    response
                      .addDevice(
                        `${gatewayId}-${device.R}-${device.RS[j].M}-${deviceId}`,
                        `${device.RN} ${device.RS[j].D[k]}`,
                        caps,
                      )
                      .manufacturerName('Nuos Home Automation')
                      .modelName(`${dc}`)
                      .roomName(`${device.RN}`);
                  }
                }
              }
            }
          }
          if (scenes) {
            for (var j = 0; j < scenes.SN.length; j++) {
              response
                .addDevice(
                  `${gatewayId}~scene~${scenes.R}~${scenes.SN[j]
                    .replace(/\s/g, '')
                    .replace(/[^a-zA-Z0-9 ]/g, '')
                    .toLowerCase()}~${scenes.SC[j]}~${parseInt(
                    items[i].roomID.S,
                  )}`,
                  `${scenes.RN} ${scenes.SN[j]} Scene`,
                  'c2c-switch',
                )
                .manufacturerName('Nuos Home Automation')
                .modelName('Scene')
                .roomName(`${device.RN}`);
            }
          }
        }
      }
    }
  })

  .stateRefreshHandler(async (accessToken, response) => {
    const result = await axios
      .get(`https://api.particle.io/v1/devices/?access_token=${accessToken}`)
      .then((response) => response?.data)
      .catch((error) => {
        console.error(error);
      });
    const data = await fetchItems(result);

    for (let a = 0; a < data?.length; a++) {
      const { items } = data[a];
      const { gatewayId } = data[a];
      for (let i = 0; i < items.length; i++) {
        if (
          parseInt(items[i].roomID.S) >= 0 &&
          parseInt(items[i].roomID.S) <= 20 &&
          items[i].deviceNamesJSON.S !== 'Empty' &&
          items[i].sceneNamesJSON.S !== 'Empty'
        ) {
          const device = eval(`(${items[i].deviceNamesJSON.S})`)[0];
          if (device) {
            for (let j = 0; j < device.RS.length; j++) {
              if (
                allowedModuleType.indexOf(device.RS[j].MT) >= 0 &&
                device.RS[j].D.length > 0
              ) {
                for (let k = 0; k <= device.RS[j].DT.length; k++) {
                  if (
                    device.RS[j].DT[k] > 0 &&
                    !/Device/i.test(device.RS[j].D[k])
                  ) {
                    const deviceId = k + 1;
                    const { power, brightness, range } = await getCurrentState(
                      gatewayId,
                      device.R,
                      device.RS[j].M,
                      deviceId,
                      accessToken,
                    );
                    if (
                      dimmableDeviceTypes.indexOf(device.RS[j].DT[k]) >= 0 &&
                      !device.RS[j].D[k].includes('Fan')
                    ) {
                      response.addDevice(
                        `${gatewayId}-${device.R}-${device.RS[j].M}-${deviceId}`,
                        [
                          {
                            component: 'main',
                            capability: 'st.switch',
                            attribute: 'switch',
                            value: power?.toLowerCase(),
                          },
                          {
                            component: 'main',
                            capability: 'st.colorControl',
                            attribute: 'hue',
                            value: brightness || 0,
                          },
                        ],
                      );
                    } else if (
                      rangeControlledDeviceTypes.indexOf(device.RS[j].DT[k]) >=
                        0 &&
                      device.RS[j].D[k].includes('Fan')
                    ) {
                      response.addDevice(
                        `${gatewayId}-${device.R}-${device.RS[j].M}-${deviceId}`,
                        [
                          {
                            component: 'main',
                            capability: 'st.switch',
                            attribute: 'switch',
                            value: power?.toLowerCase(),
                          },
                          {
                            component: 'main',
                            capability: 'st.switchLevel',
                            attribute: 'level',
                            value: range || 1,
                          },
                        ],
                      );
                    } else {
                      response.addDevice(
                        `${gatewayId}-${device.R}-${device.RS[j].M}-${deviceId}`,
                        [
                          {
                            component: 'main',
                            capability: 'st.switch',
                            attribute: 'switch',
                            value: power?.toLowerCase(),
                          },
                        ],
                      );
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  })
  .commandHandler(async (accessToken, response, devices) => {
    let power = '0!';

    for (const device of devices) {
      const deviceResponse = response.addDevice(device.externalDeviceId);
      for (const cmd of device.commands) {
        const state = {
          component: cmd.component,
          capability: cmd.capability,
        };
        if (cmd.command === 'off') {
          power = '0!';
        }
        if (cmd.command === 'on') {
          power = '255!';
        }

        if (!device.externalDeviceId.includes('scene')) {
          const d = device.externalDeviceId.split('-');
          const command = `ctrl/${d[1]}*${d[2]}@${d[3]},${power}`;
          await callParticleAPI(d[0], accessToken, command, true);
        } else {
          const d = device.externalDeviceId.split('~');
          const command = d[4];
          const roomId = d[5];
          var onCommand = command;
          var offCommand = `alof/${roomId}*0@0,0!`;
          await callSceneFunction(
            d[0],
            accessToken,
            onCommand,
            offCommand,
            cmd.command,
          );
        }

        if (cmd.capability === 'st.switchLevel' && cmd.command === 'setLevel') {
          state.attribute = 'level';
          state.value = deviceStates.level = cmd.arguments[0];
          deviceResponse.addState(state);
        } else if (cmd.capability === 'st.switch') {
          state.attribute = 'switch';
          state.value = deviceStates.switch =
            cmd.command === 'on' ? 'on' : 'off';
          deviceResponse.addState(state);
        } else {
          deviceResponse.setError(
            `Command '${cmd.command} of capability '${cmd.capability}' not supported`,
            DeviceErrorTypes.CAPABILITY_NOT_SUPPORTED,
          );
        }
      }
    }
  });
