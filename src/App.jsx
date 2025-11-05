import { BrowserRouter } from "react-router-dom";
import {
	About,
	Contact,
	Experience,
	Hero,
	Navbar,
	Tech,
	Works,
	MyCompany,
	Build,
	StarsCanvas,
	ScrollToTop,
} from "./components";
import SideNavbar from "./components/SideNavbar";
import LanguagePrompt from "./components/LanguagePrompt";
import SectionSentinel from "./components/SectionSentinel";
import { CanvasBudgetProvider } from "./context/CanvasBudgetContext";

const App = () => {
	return (
		<BrowserRouter>
			<CanvasBudgetProvider>
			<div className='relative z-0 bg-primary'>
				<LanguagePrompt />
				<div className='relative z-0 bg-hero-pattern bg-cover bg-no-repeat bg-center'>
					<Navbar />
					<SideNavbar />
					<Hero />
					<SectionSentinel sectionIndex={0} />
					<StarsCanvas key="hero-stars" sectionIndex={0} />
				</div>
				<div className='relative z-0'>
					<About />
					<SectionSentinel sectionIndex={1} />
					<StarsCanvas key="about-stars" sectionIndex={1} />
				</div>
				<div className='relative z-0 bg-black'>
					<Experience />
					<SectionSentinel sectionIndex={2} />
					<StarsCanvas key="experience-stars" sectionIndex={2} />
				</div>
				<div className='relative z-0 pt-20 pb-40 bg-black'>
					<Tech />
					<SectionSentinel sectionIndex={3} />
					<StarsCanvas key="tech-stars" sectionIndex={3} />
				</div>
				<div className='relative z-0 bg-black'>
					<Works />
					<SectionSentinel sectionIndex={4} />
					<StarsCanvas key="works-stars" sectionIndex={4} />
				</div>
				<div className='relative z-0'>
					<MyCompany />
					<SectionSentinel sectionIndex={5} />
					<StarsCanvas key="wolfcave-stars" sectionIndex={5} />
				</div>
				<div className='relative z-0 bg-black'>
					<Build />
					<SectionSentinel sectionIndex={6} />
					<StarsCanvas key="build-stars" sectionIndex={6} />
				</div>
				<div className='relative z-0'>
					<Contact />
					<SectionSentinel sectionIndex={7} />
					<StarsCanvas key="contact-stars" sectionIndex={7} />
				</div>
				<ScrollToTop />
			</div>
			</CanvasBudgetProvider>
		</BrowserRouter>
	);
};

export default App;
