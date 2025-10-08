import { Button } from "@/components/ui/button"

export default function groupView(){
    return(
        <main>
            <div className="flex flex-wrap items-center gap-2 md:flex-row">
                <Button variant="outline">Add Group</Button>
            </div>
        </main>
    );
}