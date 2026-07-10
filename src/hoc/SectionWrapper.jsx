import { motion } from "framer-motion";
import { styles } from "../styles";
import { staggerContainer } from "../utils/motion";


const SectionWrapper = (Component, idName, maxWidth = "max-w-7xl") =>
    function HOC() {
        return (
            <motion.section
                variants={staggerContainer()}
                initial='hidden'
                whileInView='show'
                viewport={{
                    once: true,
                    amount: 0.1
                }}
                className={`${styles.padding} ${maxWidth} mx-auto realtive z-0`}
            >
                <span className="hash-span" id={idName}>
                    &nbsp;
                </span>
                <Component/>
            </motion.section>
        )
    }
   
        


export default SectionWrapper