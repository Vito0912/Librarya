import Image from 'next/image'

interface BookProps {
    id: number;
    title: string;
    authors: number[];
}

const Book: React.FC<BookProps> = ({id, title, authors}) => {

    let image_path = `/book-covers/${id}.jpg`;

    // check if image exists
    // if not, use default image


    return (
        <div className="border-2 border-dashed border-gray-300 rounded-lg dark:border-gray-600 col-sm-3 col-lg-2 col-xs-6 max-w-[200px]">
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
                <div>{title}</div>
                <div>{authors.toString()}</div>
            </div>
        </div>
    );
}


export default Book;