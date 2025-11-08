import { useRef } from "react";
import { gsap, SplitText, ScrollTrigger } from "./gsap";
import SectionTitle from "./SectionTitle";
import useLayoutEffect from "@/hooks/use-isomorpphic-layout-effect";

const About = () => {
    let el = useRef(null);
    let q = gsap.utils.selector(el);

    useLayoutEffect(() => {
        document.fonts.ready.then(function () {
            const split = new SplitText(q(".about-text"), {type:"lines,words", linesClass:"split-line"});

            const anim = gsap.from(split.lines,  {
                duration: 0.6,
                autoAlpha: 0,
                translateY: '100%',
                ease: 'circ.out',
                stagger: 0.05,
                paused: true
            });
    
            ScrollTrigger.create({
                trigger: '.about-text',
                start: 'top 80%',
                onEnter: () => anim.play(),
            }); 
        });
    }, [])

    return (
        <div ref={el} id="about" className="pb-40 w-full relative px-[10vw] 2xl:px-[12.5vw] bg-slate-100">
            <SectionTitle title="关于本项目"/>
            <p className="about-text text-neutral-900 text-[clamp(1.4rem,2vw,1.75rem)] text-center font-silka leading-[1.8] will-change-transform">
                NFT市场的开放性和无需许可特性使其面临严重的伪造品威胁，高达80%的NFT可能是伪造品或欺诈。传统检测方法专注于图像相似度，忽略了文本信息的关键作用。通过大规模实证研究，我们发现98%的NFT伪造品依赖文本模仿，86%的用户通过文本搜索发现NFT。本研究提出了首个面向消费者的NFT伪造品检测框架，结合文本风险评估(PCF)和视觉指纹验证(ACV)，实现92%文本检测准确率和88%视觉验证准确率，相比传统方法提升50倍处理速度。
            </p>
            
        </div>
    )
}

export default About;