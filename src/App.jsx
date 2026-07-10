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
import PokemonBackground from "./components/PokemonBackground";
import { ServicesGameProvider } from "./context/ServicesGameContext";
// Binary (pure black/white) silhouette of the hero landscape, used ONLY as a
// luminance mask for the section transitions. Thresholded so the sky is fully
// opaque and the mountains fully transparent (the source photo's sky is ~L242,
// which left the fill ~95% opaque and let the background bleed through).
import sectionMask from "./assets/herobg-mask.png";

const App = () => {
	return (
		<BrowserRouter>
			<div className='relative z-0 bg-primary w-full max-w-full overflow-x-hidden'>
				<div className='relative z-0 bg-hero-pattern bg-cover bg-no-repeat bg-center'>
					<Navbar />
					<SideNavbar />
					<Hero />
					<StarsCanvas key="hero-stars" />
				</div>
				<div className='relative z-0 pb-28 md:pb-44'>
					<About />
					<StarsCanvas key="about-stars" />
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
							'--tr-mask': `url(${sectionMask})`,
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
					<div className='arcade-bottom-fade' aria-hidden='true' />
						<Projects />
				</div>
				<div className='relative z-0 bg-[#e9edf1] pt-[360px]'>
					{/* Projects → Experience transition */}
					<div
						className='section-transition'
						aria-hidden='true'
						style={{ '--tr-from': '#ff8f45', '--tr-mask': `url(${sectionMask})` }}
					/>
					<Experience />
				</div>
				<div className='relative z-0 bg-[#DEB887] pt-[360px]'>
					{/* Experience → Stack transition */}
					<div
						className='section-transition'
						aria-hidden='true'
						style={{ '--tr-from': '#e9edf1', '--tr-mask': `url(${sectionMask})` }}
					/>
					<Tech />
				</div>
				<ServicesGameProvider total={6}>
					<div className='relative z-0 pokemon-bg pt-[472px] sm:pt-[536px] pb-[640px] sm:pb-96' style={{ '--pf-top': '360px' }}>
						{/* Stack → Services transition (solid: no reveal, keeps the Game Boy out of the mountains) */}
						<div
							className='section-transition'
							aria-hidden='true'
							style={{ '--tr-from': '#DEB887', '--tr-to': '#d9dac4', '--tr-mask': `url(${sectionMask})` }}
						/>
						<PokemonBackground />
						<div className='relative z-10'>
							<Works />
						</div>
					</div>
				</ServicesGameProvider>
				<div className='relative z-0 overflow-hidden'>
					{/* Contact background (hero image flipped -> white), pinned to the bottom region, BEHIND the shared starfield */}
					<div aria-hidden='true' className='absolute inset-x-0 bottom-0 h-[122vh] z-[-2] bg-[#f2f2f2] pointer-events-none'>
						<div className='absolute inset-x-0 top-0 h-screen bg-hero-pattern bg-cover bg-no-repeat bg-center -scale-y-100' />
					</div>
					{/* Single shared starfield spanning Startup + Contact (visible over dark areas, invisible over the white) */}
					<StarsCanvas key="bottom-stars" />
					<div className='relative z-0 pt-[360px]'>
						{/* Services → Startup transition (solid black mountains, sky compensated to render as #B1B29B) */}
						<div
							className='section-transition'
							aria-hidden='true'
							style={{ '--tr-from': '#BABBA3', '--tr-to': '#000000', '--tr-mask': `url(${sectionMask})` }}
						/>
						<MyCompany />
					</div>
					<div className='relative z-0 min-h-screen flex flex-col justify-end translate-y-20 [&>section]:min-w-0 [&>section]:w-full'>
						<Contact />
					</div>
					<div aria-hidden='true' className='h-[22vh]' />
				</div>
				<Footer />
				<ScrollToTop />
			</div>
		</BrowserRouter>
	);
};

export default App;
