#!/usr/bin/env node
'use strict';

(function(){
	var CronJob = require('cron').CronJob;
	var oldIp = '';
	
	var job = new CronJob({
		cronTime: '00 * * * * 0-6',
		onTick: function () {
			var publicIp = require('public-ip');
			var request = require('request');
			
			publicIp
				.v4()
				.then(newIp => {
					if (oldIp != newIp) {
						oldIp = newIp;
						
						request.post({
							url: process.env.END_POINT,
							form: { value: newIp },
							headers: {
								'authorization': process.env.AUTHORIZATION,
								'Content-Type': 'application/json'
							}
						});
					}
				});
		},
		start: true,
		timeZone: 'America/Los_Angeles'
	});

	job.start();
    
})();