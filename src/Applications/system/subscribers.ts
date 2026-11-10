import { Actions, bus } from "#Domain";
import { Logger } from "#common/logger-handler/make.js";

const _logger = new Logger("Subscribers");

// notice
bus.on(Actions.NOTICE_BIRTHDAY, (event) => _logger.debug(`event*${Actions.NOTICE_BIRTHDAY}*\n`, event));
bus.on(Actions.NOTICE_CHRISMAS, (event) => _logger.debug(`event*${Actions.NOTICE_CHRISMAS}*\n`, event));
bus.on(Actions.NOTICE_NEW_YEAR, (event) => _logger.debug(`event*${Actions.NOTICE_NEW_YEAR}*\n`, event));

// queue
bus.on(Actions.QUEUE_PUBLISH, () => { });
bus.on(Actions.QUEUE_CONSUME, () => { });

// payments
/*bus.on("payments/visa", (event) => {
	void new VisaEventAction(event).init();
	void visaWebHook(event);
	void saveTransaction(event);
})*/
