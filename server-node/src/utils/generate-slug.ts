import slugifyLib from "slugify";

export function generateSlug(input: string) {
	return (slugifyLib as unknown as typeof slugifyLib.default)(input, { lower: true });
}
