<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Member>
 */
class MemberFactory extends Factory
{
    public function definition(): array
    {
        return [
            // 'group_id' => $this->group->id,
            'name' => $this->faker->name,
            'ratio' => $this->faker->randomDigitNotZero(),
            'total_expenses' => 0,
            'total_payments' => 0
        ];
    }
}
