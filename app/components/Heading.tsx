/** @format */
interface hendings {
  text: string;
  subtext: string;
  styles: string;
}
const Heading = ({ text, subtext, styles }: hendings) => {
  return (
    <div className={styles}>
      {text && <h1 className='font-bold text-4xl'>{text}</h1>}
      {subtext && <p className=''>{subtext}</p>}
    </div>
  );
};

export default Heading;
