import WxNotFound from "@components/NotFound/WxNotFound";
import WxAccordion from "@components/WxAccordion";
import { AppsService } from "services/api/Apps.service";
import Preloader from "services/utils/preloader.service";
import { useEffect, useState } from "react";

const FAQTab = ({ appId }) => {
	const [faq, setFaq] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		setIsLoading(true);
		AppsService.getAppFAQ({ body: { appId } })
			.then((res) => setFaq(res.body))
			.finally(() => setIsLoading(false));
	}, [appId]);

	if (isLoading) return <Preloader />;

	return (
		<div className="wx__fqa">
			{faq.length ? (
				<WxAccordion
					data={faq}
					labelKey="faqQuestion"
					descriptionKey="faqAnswer"
				/>
			) : (
				!isLoading && <WxNotFound title="No FAQ found!" />
			)}
		</div>
	);
};

export default FAQTab;
