import { Html, useProgress } from '@react-three/drei'
const Loader = () => {
  const { progress } = useProgress();
  
  return (
		<Html>
			<span className='canvas-load'></span>
			<p
				style={{
					fontSize: 30,
					color: "#d39f1f",
					fontWeight: 800,
					marginTop: 30,
					marginLeft: -70,
				}}>
				{" "}
				{progress.toFixed(2)}%{" "}
			</p>
		</Html>
	);
}

export default Loader