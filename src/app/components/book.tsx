import Image from 'next/image'

interface BookProps {
    id: number;
    title: string;
    authors: number[];
}

const Book: React.FC<BookProps> = ({id, title, authors}) => {

    let image_path = `/book-covers/${id}.jpg`;

    // TODO:
    // check if image exists
    // if not, use default image


    return (
        <div className="rounded-lg col-sm-3 col-lg-2 col-xs-6 max-w-[200px]">
            <div id={"image-" + id}>
                <span>
                    <Image
                    src={`/book-covers/placeholder.jpg`}
                    alt={title}
                    width={200}
                    height={100}
                    />
                </span>
            </div>
            <div id='book-info'>
                <div>{<a href={'./content/media/' + id}>{title}</a>}</div>
                <div>{authors.toString()}</div>
            </div>
        </div>
    );
}


export default Book;