const TuyAPI = require('tuyapi');

const device = new TuyAPI({
  id: 'bf924f98fcbd83c086ars2',        // Replace with actual device ID
  key: 'g!8+GGgGItK.x9FC',       // Replace with actual device local key 
  ip: '192.168.50.60',  // Your device's IP
  version: '3.3' 
});

let stateHasChanged = false;

// Find device on network
device.find().then(() => {
  // Connect to device
  device.connect();
});

// Add event listeners
device.on('connected', () => {
  console.log('Connected to device!');
  
  // Enable debugging: get all available data from device
  device.get({schema: true}).then(data => {
    console.log('Initial device data with schema:', data);
  }).catch(err => {
    console.error('Error getting initial data:', err);
  });
});

device.on('disconnected', () => {
  console.log('Disconnected from device.');
});

device.on('error', error => {
  console.log('Error!', error);
});

device.on('dp-refresh', data => {
    console.log('Refresh: data from device:', data);
});

device.on('data', data => {
  console.log('Data from device:', data);

  // Enable debugging: get fresh data periodically
  device.refresh({schema: true}).then(refreshData => {
    console.log('Refreshed data with schema:', refreshData);
  }).catch(err => {
    console.error('Error refreshing data:', err);
  });

  // Add debugging for data points
  if (data.dps) {
    console.log('Available data points:', Object.keys(data.dps));
    Object.entries(data.dps).forEach(([key, value]) => {
      console.log(`DP ${key}: ${value} (type: ${typeof value})`);
    });
  }

  //console.log(`Boolean status of default property: ${data.dps['1']}.`);

  // Set default property to opposite
  //if (!stateHasChanged) {
  //  device.set({set: !(data.dps['1'])});
  //  stateHasChanged = true;
 // }
});

// Disconnect after 10 seconds
setTimeout(() => { device.disconnect(); }, 10000);