import Project from './Feature';
import SectionTitle from './SectionTitle';

const Features = () => {
	return (
		<div
			id='projects'
			className='relative w-full bg-neutral-100 px-[10vw] pb-36 2xl:px-[12.5vw]'>
			<SectionTitle title='项目特色' />
			<div className='flex flex-col gap-[70px] xl:gap-[90px]'>
				<Project
					name='被动文本过滤器 (PCF)'
					desc='通过分析文本印记(Textual Imprint)，基于认知心理学原理(独特性、熟悉度、要点痕迹保留)计算文本风险评分β。PCF能够快速识别可能误导消费者的文本特征，支持跨链和预发布检测，实现92%的检测准确率。'
					stack={['文本印记提取', '风险评分算法', 'KD-tree索引', '同形字符检测']}
					links={[
						['github', null],
						['external', null],
					]}
                    images={['/images/doc.png','/images/doc.png','/images/doc.png']}
				/>
				<div className='my-3 h-[1px] w-full bg-neutral-300'></div>
                <Project
                    name='主动视觉验证器 (ACV)'
                    desc='通过提取定制化指纹(Tailored Fingerprint)，包括颜色、纹理、构图和内容四个维度特征，利用NFT收藏内部风格高度一致性的特点进行高效比对。ACV支持图像和视频NFT，实现88%的验证准确率，查询时间约38ms。'
                    stack={['pHash算法', '特征提取', '指纹匹配', '视频关键帧']}
                    links={[
                        ['github', null],
                        ['external', null],
                    ]}
                    images={['/images/doc.png','/images/doc.png']}
                    />
                <div className='my-3 h-[1px] w-full bg-neutral-300'></div>
                <Project
                    name='大规模数据集'
                    desc='构建了首个大规模NFT伪造品数据集，包含102个正版收藏和12,221个伪造品收藏，涵盖701,858张图片和23,682个视频，以及超过540万笔交易记录。数据集支持native和non-native伪造品检测研究。'
                    stack={['数据收集', '手动标注', '质量验证', '多模态数据']}
                    links={[
                        ['github', null],
                        ['external', null],
                    ]}
                    images={['/images/doc.png','/images/doc.png','/images/doc.png']}
                />
                <div className='my-3 h-[1px] w-full bg-neutral-300'></div>
				<Project
					name='两阶段协同检测'
					desc='PCF作为前端轻量级过滤器进行实时文本风险评估，ACV对高风险案例进行精确的视觉验证。两阶段协同工作实现50倍加速，相比传统深度嵌入方法，在保持高准确率的同时大幅提升处理效率。'
					stack={[
						'两阶段架构',
						'协同检测',
						'实时处理',
						'可扩展性',
					]}
					links={[
						['github', null],
						['external', null],
					]}
                    images={['/images/doc.png','/images/doc.png']}
				/>
			</div>
		</div>
	);
};

export default Features;