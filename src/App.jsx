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
	Footer,
	StarsCanvas,
	ScrollToTop,
} from "./components";
import SideNavbar from "./components/SideNavbar";
import SectionSentinel from "./components/SectionSentinel";
import PokemonBackground from "./components/PokemonBackground";
import { CanvasBudgetProvider } from "./context/CanvasBudgetContext";
import { ServicesGameProvider } from "./context/ServicesGameContext";
import herobg from "./assets/herobg.png";

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
				<div className='relative z-0 arcade-bg pt-[360px]'>
					{/* About → Projects transition: hero mountain silhouette as a
					    luminance mask overlaying the arcade top. Black "sky" blends
					    into About above; the mountains are transparent so the real
					    arcade background shows through (perfect colour match) and the
					    harsh top of the sunburst is hidden behind the sky.
					    The pt-[360px] pushes the content clear of this overlay. */}
					<div
						className='section-transition'
						aria-hidden='true'
						style={{
							'--tr-from': '#000000',
							'--tr-mask': `url(${herobg})`,
						}}
					/>
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
				<div className='relative z-0 bg-[#e9edf1] pt-[360px]'>
					{/* Projects → Experience transition */}
					<div
						className='section-transition'
						aria-hidden='true'
						style={{ '--tr-from': '#ff8f45', '--tr-mask': `url(${herobg})` }}
					/>
					<Experience />
					<SectionSentinel sectionIndex={3} />
				</div>
				<div className='relative z-0 bg-[#DEB887] pt-[360px]'>
					{/* Experience → Stack transition */}
					<div
						className='section-transition'
						aria-hidden='true'
						style={{ '--tr-from': '#e9edf1', '--tr-mask': `url(${herobg})` }}
					/>
					<Tech />
					<SectionSentinel sectionIndex={4} />
				</div>
				<ServicesGameProvider total={6}>
					<div className='relative z-0 pokemon-bg pt-[472px] sm:pt-[536px] pb-60 sm:pb-96' style={{ '--pf-top': '360px' }}>
						{/* Stack → Services transition (solid: no reveal, keeps the Game Boy out of the mountains) */}
						<div
							className='section-transition'
							aria-hidden='true'
							style={{ '--tr-from': '#DEB887', '--tr-to': '#d9dac4', '--tr-mask': `url(${herobg})` }}
						/>
						<PokemonBackground />
						<div className='relative z-10'>
							<Works />
						</div>
						<SectionSentinel sectionIndex={5} />
					</div>
				</ServicesGameProvider>
				<div className='relative z-0 overflow-hidden'>
					{/* Contact background (hero image flipped -> white), pinned to the bottom region, BEHIND the shared starfield */}
					<div aria-hidden='true' className='absolute inset-x-0 bottom-0 h-[122vh] z-[-2] bg-[#f2f2f2] pointer-events-none'>
						<div className='absolute inset-x-0 top-0 h-screen bg-hero-pattern bg-cover bg-no-repeat bg-center -scale-y-100' />
					</div>
					{/* Single shared starfield spanning Startup + Contact (visible over dark areas, invisible over the white) */}
					<StarsCanvas key="bottom-stars" sectionIndex={6} />
					<div className='relative z-0 pt-[360px]'>
						{/* Services → Startup transition (solid black mountains, sky compensated to render as #B1B29B) */}
						<div
							className='section-transition'
							aria-hidden='true'
							style={{ '--tr-from': '#BABBA3', '--tr-to': '#000000', '--tr-mask': `url(${herobg})` }}
						/>
						<MyCompany />
						<SectionSentinel sectionIndex={6} />
					</div>
					<div className='relative z-0 min-h-screen flex flex-col justify-end translate-y-20'>
						<Contact />
						<SectionSentinel sectionIndex={7} />
					</div>
					<div aria-hidden='true' className='h-[22vh]' />
				</div>
				<Footer />
				<ScrollToTop />
			</div>
			</CanvasBudgetProvider>
		</BrowserRouter>
	);
};

export default App;
