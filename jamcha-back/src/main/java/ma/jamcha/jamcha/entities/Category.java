package ma.jamcha.jamcha.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "categories")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true)
    private String slug;

    private String color;
    private String icon;

    @Column(columnDefinition = "json")
    private String translations;

    @OneToMany(mappedBy = "category", fetch = FetchType.LAZY)
    private List<Article> articles;
}
