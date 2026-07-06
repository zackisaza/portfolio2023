import { BrowserRouter } from "react-router-dom";
import {
	About,
	Contact,
	Experience,
	Hero,
	Navbar,
	Projects,
	Tech,
	Works,
	MyCompany,
	Build,
	StarsCanvas,
	ScrollToTop,
} from "./components";
import SideNavbar from "./components/SideNavbar";
import SectionSentinel from "./components/SectionSentinel";
import PokemonBackground from "./components/PokemonBackground";
import { CanvasBudgetProvider } from "./context/CanvasBudgetContext";

const App = () => {
	return (
		<BrowserRouter>
			<CanvasBudgetProvider>
			<div className='relative z-0 bg-primary w-full max-w-full overflow-x-hidden'>
				<div className='relative z-0 bg-hero-pattern bg-cover bg-no-repeat bg-center'>
					<Navbar />
					<SideNavbar />
					<Hero />
					<SectionSentinel sectionIndex={0} />
					<StarsCanvas key="hero-stars" sectionIndex={0} />
				</div>
				<div className='relative z-0 pb-28 md:pb-44'>
					<About />
					<SectionSentinel sectionIndex={1} />
					<StarsCanvas key="about-stars" sectionIndex={1} />
				</div>
				<div className='relative z-0 arcade-bg'>
					<div className='arcade-fx' aria-hidden='true'>
						<span style={{ "--x": "8%", "--s": "90px", "--c": "#ff7a45", "--d": "0s", "--dur": "15s" }} />
						<span style={{ "--x": "22%", "--s": "54px", "--c": "#ffd15c", "--d": "3s", "--dur": "18s" }} />
						<span style={{ "--x": "40%", "--s": "120px", "--c": "#ff5c4f", "--d": "6s", "--dur": "22s" }} />
						<span style={{ "--x": "58%", "--s": "70px", "--c": "#ffb347", "--d": "2s", "--dur": "17s" }} />
						<span style={{ "--x": "73%", "--s": "100px", "--c": "#ff8a3d", "--d": "8s", "--dur": "20s" }} />
						<span style={{ "--x": "88%", "--s": "60px", "--c": "#ffe08a", "--d": "5s", "--dur": "16s" }} />
						<span style={{ "--x": "48%", "--s": "44px", "--c": "#ffffff", "--d": "10s", "--dur": "19s" }} />
					</div>
					<Projects />
					<SectionSentinel sectionIndex={2} />
				</div>
				<div className='relative z-0 bg-[#e9edf1]'>
					<Experience />
					<SectionSentinel sectionIndex={3} />
				</div>
				<div className='relative z-0 bg-[#DEB887]'>
					<Tech />
					<SectionSentinel sectionIndex={4} />
				</div>
				<div className='relative z-0 pokemon-bg'>
					<PokemonBackground />
					<div className='relative z-10'>
						<Works />
					</div>
					<SectionSentinel sectionIndex={5} />
				</div>
				<div className='relative z-0'>
					<MyCompany />
					<SectionSentinel sectionIndex={6} />
					<StarsCanvas key="wolfcave-stars" sectionIndex={6} />
				</div>
				<div className='relative z-0 bg-black'>
					<Build />
					<SectionSentinel sectionIndex={7} />
					<StarsCanvas key="build-stars" sectionIndex={7} />
				</div>
				<div className='relative z-0'>
					<Contact />
					<SectionSentinel sectionIndex={8} />
					<StarsCanvas key="contact-stars" sectionIndex={8} />
				</div>
				<ScrollToTop />
			</div>
			</CanvasBudgetProvider>
		</BrowserRouter>
	);
};

export default App;
